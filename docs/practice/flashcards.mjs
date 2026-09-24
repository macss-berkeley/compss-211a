import {skills} from './catalog.mjs';
const card=(id,skill,deck,prompt,code,answer,answerCode='',explanation='')=>({id,skill,deck,prompt,code,answer,answerCode,explanation});
export const flashcards=[
card('assignment-copy','variables-and-assignment','Python','What does print(y) display?','x = 4\ny = x + 2\nx = 10\nprint(y)','6','','y was assigned 6 before x changed.'),
card('type-conversion','basic-data-types','Python','What value and type does total have?','total = int("3") + 2','The integer 5.'),
card('list-index','lists-and-indexing','Python','What does this print?','modes = ["bus", "bike", "walk"]\nprint(modes[-1])','walk','','Index -1 selects the last item.'),
card('list-slice','lists-and-indexing','Python','What does this slice return?','values = [10, 20, 30, 40]\nvalues[1:3]','[20, 30]','','The start index is included; the stop index is excluded.'),
card('dict-key','dictionaries-and-keys','Python','Write the expression that returns the days value.','record = {"mode": "bus", "days": 3}','','record["days"]'),
card('string-clean','strings','Python','What string does this return?','"  Bus Stop  ".strip().lower()','"bus stop"'),
card('compare-assign','operators','Python','What is the difference between = and ==?','','= assigns a value. == compares values for equality.'),
card('remainder','operators','Python','What does 17 % 5 return?','','2','','% returns the remainder after division.'),
card('conditional-boundary','conditionals','Python','What does this print?','cost = 20\nif cost < 20:\n    print("low")\nelse:\n    print("high")','high','','20 is not less than 20.'),
card('loop-total','for-loops','Python','What is the final value of total?','total = 0\nfor n in [2, 3, 4]:\n    total += n','9'),
card('call-default','calling-functions','Python','What does add_fee(10, fee=3) return?','def add_fee(cost, fee=2):\n    return cost + fee','13','','The supplied fee replaces the default for this call.'),
card('return-print','writing-functions','Python','What does result contain?','def double(n):\n    print(n * 2)\n\nresult = double(3)','None','','The function prints 6, but has no return statement.'),
card('write-function','writing-functions','Python','Write a function called double that returns twice its input.','','','def double(n):\n    return n * 2'),
card('method-call','values-variables-functions-and-methods','Python','Which call is a method, and which is a function?','text.strip()\nlen(text)','text.strip() is a method call. len(text) is a function call.'),
card('trace-loop','read-code-line-by-line','Python','What does this print?','kept = []\nfor n in [2, 5, 8]:\n    if n > 4:\n        kept.append(n * 2)\nprint(kept)','[10, 16]'),
card('import-alias','import-packages','Python','Import pandas using its usual alias.','','','import pandas as pd'),
card('keyerror','read-tracebacks','Python','What does this error tell you to check?','df["seat"]\n# KeyError: \'seat\'','Check whether the column "seat" exists, including spelling and capitalization.','','Inspect df.columns.'),
card('assert-count','test-your-code','Python','Write an assertion that checks df has 100 rows.','','','assert len(df) == 100'),
card('module-call','import-your-own-code','Python','Call summarize_requests from this imported module, passing requests.','import case_summary','','case_summary.summarize_requests(requests)'),
card('load-csv','load-tabular-data','pandas','Read data/commute.csv into a DataFrame named df. Assume pandas is imported as pd.','','','df = pd.read_csv("data/commute.csv")'),
card('shape','inspect-a-dataframe','pandas','What do the two numbers mean?','df.shape\n# (120, 5)','120 rows and 5 columns.'),
card('select-columns','select-and-filter','pandas','Select the mode and days columns as a DataFrame.','','','df[["mode", "days"]]'),
card('filter-rows','select-and-filter','pandas','Keep rows where days is at least 3.','','','df[df["days"] >= 3]'),
card('combine-pandas','combining-conditions','pandas','Keep rows where days is at least 3 AND mode is "bus".','','','df[(df["days"] >= 3) & (df["mode"] == "bus")]','Put parentheses around each comparison. Use & for elementwise AND.'),
card('new-column','create-or-modify-columns','pandas','Create a total column by multiplying fare by trips.','','','df["total"] = df["fare"] * df["trips"]'),
card('missing-mean','missing-values','pandas','What is the mean of the known values: 10, missing, 30?','','20','','Replacing the missing value with zero would change the mean to about 13.3.'),
card('count-size','summaries-and-grouping','pandas','How do count() and size() differ when summarizing a group?','','count() counts nonmissing values in a column. size() counts all rows in the group.'),
card('category-shares','sort-and-count','pandas','Return proportions for each value in the mode column.','','','df["mode"].value_counts(normalize=True)'),
card('preserve-id','convert-data-types','pandas','Why store an ID such as "00123" as text?','','To preserve the leading zeros. An identifier is a label, not a quantity.'),
card('join-duplicates','join-tables','pandas','How many rows will the inner join produce?','left IDs:  A, B\nright IDs: A, A, B\nleft.merge(right, on="id", how="inner")','3','','A produces two matching pairs; B produces one.'),
card('nested-access','csv-and-json','Python','Return the first result’s title.','response = {"results": [{"title": "Transit"}]}','','response["results"][0]["title"]'),
card('month-year','dates-and-times','pandas','Create a year-and-month grouping key from a datetime column called date.','','','df["date"].dt.to_period("M")','Using .dt.month alone combines the same month across different years.'),
card("optional-key", "dictionaries-and-keys", "Python", "Read an optional country key from record, returning None if it is absent.", "", "", "record.get(\"country\")", "Bracket access raises KeyError when the key is absent."),
card("list-alias", "lists-and-indexing", "Python", "What is in original after these lines run?", "original = [\"id\", \"cost\"]\ncolumns = original\ncolumns.append(\"program\")", "[\"id\", \"cost\", \"program\"]", "", "Both names refer to the same list. Use original.copy() if you need a separate list."),
card("format-percentage", "strings", "Python", "Format share as a percentage with one decimal place.", "share = 0.237", "", "f\"{share:.1%}\"", "The result is \"23.7%\". The format multiplies by 100 for display."),
card("membership-values", "operators", "Python", "Check whether mode is either \"bus\" or \"train\".", "", "", "mode in [\"bus\", \"train\"]", ""),
card("function-missing", "writing-functions", "Python", "Write cost_label(cost): return \"missing\" for None, \"low\" below 20, otherwise \"high\".", "", "", "def cost_label(cost):\n    if cost is None:\n        return \"missing\"\n    return \"low\" if cost < 20 else \"high\"", ""),
card("name-error", "read-tracebacks", "Python", "What should you check after NameError: name 'df' is not defined?", "", "Check whether df was assigned, whether its name is spelled correctly, and whether the cell or script that creates it has run.", "", ""),
card("notebook-hidden-state", "jupyter-notebooks", "Python", "A notebook works only when you run its cells in a particular order. How do you check that someone else can reproduce it?", "", "Restart the kernel and run all cells from top to bottom. Fix dependencies on variables created in an earlier session.", "", ""),
card("api-status", "web-apis", "Python", "Check for an HTTP error before parsing this response as JSON.", "response = requests.get(url, timeout=30)", "", "response.raise_for_status()\ndata = response.json()", "A successful status still does not guarantee the fields or data are what you expected."),
card("api-next-page", "web-apis", "Python", "An API returns 25 records and a next-page cursor. Can you report that the query found 25 records?", "", "No. Follow the pagination instructions until there is no next page, then check for repeated IDs before reporting a total.", "", ""),
card("api-secret-env", "keep-api-keys-safe", "Python", "Read API_KEY from environment variables without putting its value in the notebook.", "", "", "import os\napi_key = os.environ[\"API_KEY\"]", "Set the variable outside the notebook. Do not print it or commit a .env file."),
card("inspect-dtypes", "inspect-a-dataframe", "pandas", "Show the data type of each DataFrame column.", "", "", "df.dtypes", ""),
card("missing-counts", "missing-values", "pandas", "Count missing values in each column.", "", "", "df.isna().sum()", ""),
card("missing-share", "missing-values", "pandas", "What fraction of cost values are missing?", "", "", "df[\"cost\"].isna().mean()", "True is treated as 1 and False as 0. Multiply by 100 to report a percentage."),
card("blank-is-not-na", "missing-values", "pandas", "Will isna() flag an empty string \"\" as missing?", "", "No. Normalize blank strings to a missing value before counting missingness.", "", "Spaces such as \"   \" also need explicit handling."),
card("normalize-blanks", "clean-and-document", "pandas", "Replace empty or whitespace-only strings in district with a missing value.", "", "", "df[\"district\"] = df[\"district\"].replace(r\"^\\s*$\", pd.NA, regex=True)", ""),
card("standardize-labels", "clean-and-document", "pandas", "Normalize case and surrounding spaces in mode, a text column.", "", "", "df[\"mode\"] = df[\"mode\"].str.strip().str.lower()", "Check the resulting labels before combining categories that may mean different things."),
card("map-labels", "clean-and-document", "pandas", "Replace \"M\" with \"monthly\" and \"W\" with \"weekly\" in frequency, leaving other values unchanged.", "", "", "df[\"frequency\"] = df[\"frequency\"].replace({\"M\": \"monthly\", \"W\": \"weekly\"})", ""),
card("numeric-coerce", "convert-data-types", "pandas", "Convert the text cost column to numbers, recording invalid values as missing.", "", "", "df[\"cost\"] = pd.to_numeric(df[\"cost\"], errors=\"coerce\")", "Count and inspect the values that became missing; conversion does not explain why they were invalid."),
card("numeric-failure-audit", "convert-data-types", "pandas", "You created numeric_cost using errors=\"coerce\". Select nonmissing source values that failed conversion.", "numeric_cost = pd.to_numeric(df[\"cost\"], errors=\"coerce\")", "", "df.loc[df[\"cost\"].notna() & numeric_cost.isna(), \"cost\"]", ""),
card("read-id-text", "load-tabular-data", "pandas", "Load respondents.csv while preserving leading zeros in respondent_id.", "", "", "df = pd.read_csv(\"respondents.csv\", dtype={\"respondent_id\": \"string\"})", ""),
card("drop-missing-subset", "missing-values", "pandas", "Keep only rows with an observed cost, without dropping rows just because other columns are missing.", "", "", "df.dropna(subset=[\"cost\"])", ""),
card("zero-is-observed", "missing-values", "pandas", "Why should missing income usually not be replaced with 0?", "", "Zero records an observed amount. Missing means the amount is unknown. Replacing it changes summaries and may bias comparisons.", "", ""),
card("duplicate-key-count", "explore-a-new-dataset", "pandas", "Count repeated respondent IDs after their first occurrence.", "", "", "df[\"respondent_id\"].duplicated().sum()", ""),
card("inspect-all-duplicates", "explore-a-new-dataset", "pandas", "Show every row whose case_id appears more than once, including the first occurrence.", "", "", "df[df[\"case_id\"].duplicated(keep=False)]", ""),
card("deduplicate-exact", "clean-and-document", "pandas", "Remove rows that are identical across all columns.", "", "", "df.drop_duplicates()", "First confirm that repeated identical records are accidental; repeated events may be valid observations."),
card("range-audit", "clean-and-document", "pandas", "Select observed ages outside the plausible range 0–120.", "", "", "df[df[\"age\"].notna() & ~df[\"age\"].between(0, 120)]", "Inspect the source before treating an unusual value as an error."),
card("filter-membership", "select-and-filter", "pandas", "Keep rows where mode is either \"bus\" or \"train\".", "", "", "df[df[\"mode\"].isin([\"bus\", \"train\"])]", ""),
card("filter-exclusion", "select-and-filter", "pandas", "Exclude rows labeled \"test\" or \"duplicate\" in status.", "", "", "df[~df[\"status\"].isin([\"test\", \"duplicate\"])]", ""),
card("filter-either", "combining-conditions", "pandas", "Keep rows where cost exceeds 100 OR days exceeds 4.", "", "", "df[(df[\"cost\"] > 100) | (df[\"days\"] > 4)]", ""),
card("loc-row-column", "select-and-filter", "pandas", "Return only case_id and cost for rows where cost exceeds 100.", "", "", "df.loc[df[\"cost\"] > 100, [\"case_id\", \"cost\"]]", ""),
card("loc-update", "create-or-modify-columns", "pandas", "Set cost to missing where cost is negative, in the original DataFrame.", "", "", "df.loc[df[\"cost\"] < 0, \"cost\"] = pd.NA", "Use one .loc assignment instead of chained indexing such as df[mask][\"cost\"] = ... ."),
card("filter-copy", "modify-existing-code", "pandas", "Create a separate DataFrame of nonremote respondents to edit without changing df.", "", "", "commuters = df[df[\"mode\"] != \"Remote\"].copy()", ""),
card("denominator-zero", "create-or-modify-columns", "pandas", "Compute cost per trip, leaving the result missing when trips is zero.", "", "", "df[\"cost_per_trip\"] = df[\"cost\"] / df[\"trips\"].replace(0, float(\"nan\"))", ""),
card("sort-descending", "sort-and-count", "pandas", "Sort districts by request_count, largest first.", "", "", "df.sort_values(\"request_count\", ascending=False)", ""),
card("counts-include-missing", "sort-and-count", "pandas", "Count every category in mode, including missing values.", "", "", "df[\"mode\"].value_counts(dropna=False)", ""),
card("group-count-rows", "summaries-and-grouping", "pandas", "Count requests in each district, keeping missing districts as a group.", "", "", "df.groupby(\"district\", dropna=False).size()", ""),
card("group-median-and-n", "summaries-and-grouping", "pandas", "Report median cost and the number of observed costs for each program.", "", "", "df.groupby(\"program\").agg(\n    median_cost=(\"cost\", \"median\"),\n    observed_costs=(\"cost\", \"count\")\n)", ""),
card("unique-respondents", "summaries-and-grouping", "pandas", "Count distinct nonmissing respondent IDs in each program.", "", "", "df.groupby(\"program\")[\"respondent_id\"].nunique()", ""),
card("left-join-lookup", "join-tables", "pandas", "Attach district names to requests while retaining every request. Each lookup district_id should be unique.", "", "", "requests.merge(districts, on=\"district_id\", how=\"left\", validate=\"many_to_one\")", ""),
card("unmatched-join", "join-tables", "pandas", "Find requests whose district_id has no match in the district lookup.", "", "", "joined = requests.merge(districts, on=\"district_id\", how=\"left\", indicator=True, validate=\"many_to_one\")\nunmatched = joined[joined[\"_merge\"] == \"left_only\"]", ""),
card("join-key-types", "join-tables", "pandas", "IDs match visually, but a merge fails or finds no matches. What should you inspect?", "", "Compare key types, leading zeros, spaces, capitalization, and missing values in both tables. Normalize only differences that do not change the meaning of an ID.", "", ""),
card("parse-known-date", "dates-and-times", "pandas", "Parse a date column known to use day/month/year; make invalid dates missing.", "", "", "df[\"date\"] = pd.to_datetime(df[\"date\"], format=\"%d/%m/%Y\", errors=\"coerce\")", "Specify the known format; \"03/04/2026\" is ambiguous without one."),
card("half-open-date-filter", "dates-and-times", "pandas", "Select all October 2026 records, including timestamps late on October 31. date is datetime-typed and timezone-naive.", "", "", "df[(df[\"date\"] >= \"2026-10-01\") & (df[\"date\"] < \"2026-11-01\")]", ""),
card("elapsed-hours", "dates-and-times", "pandas", "Calculate elapsed hours between datetime columns opened and closed.", "", "", "(df[\"closed\"] - df[\"opened\"]).dt.total_seconds() / 3600", "Check for negative durations and missing timestamps before summarizing."),
card("date-local-zone", "dates-and-times", "pandas", "Convert timezone-aware UTC timestamps to Berkeley local time.", "", "", "df[\"timestamp\"].dt.tz_convert(\"America/Los_Angeles\")", "tz_convert changes the displayed zone of an already-aware timestamp. It does not assign a zone to naive times."),
card("literal-text-search", "clean-text", "pandas", "Keep comments containing the literal text \"bus\", ignoring case and treating missing comments as nonmatches.", "", "", "df[df[\"comment\"].str.contains(\"bus\", case=False, na=False, regex=False)]", "This matches substrings, including \"business\". A whole-word rule requires a different pattern."),
card("text-length-audit", "clean-text", "pandas", "Recompute the character count of each comment, preserving missing comments.", "", "", "df[\"comment\"].str.len()", "Compare these lengths with any supplied length field; do not assume that field used the same text or counting rule."),
card("concat-batches", "data-structures", "pandas", "Stack two same-schema monthly DataFrames into one table with a new integer index.", "", "", "pd.concat([september, october], ignore_index=True)", "Concatenation stacks rows; it does not match records by ID or remove duplicates."),
card("save-no-index", "other-file-formats", "pandas", "Save df to cleaned.csv without writing the DataFrame index as an extra column.", "", "", "df.to_csv(\"cleaned.csv\", index=False)", ""),
card("excel-header-rows", "messy-spreadsheets", "pandas", "An Excel sheet has two title rows, then the actual header on row 3. Load it using that header.", "", "", "df = pd.read_excel(\"survey.xlsx\", skiprows=2)", "Inspect the result for footnotes, totals rows, merged cells, and columns read as text."),
card("reconcile-counts", "clean-and-document", "pandas", "A filter leaves 93 of 100 records. What should your cleaning note record?", "", "The rule, why it was used, the 7 removed records, and the 93 remaining records. Keep the raw file and make the change reproducible.", "", ""),
card("check-unique-key", "test-your-code", "pandas", "Assert that case_id is both nonmissing and unique.", "", "", "assert df[\"case_id\"].notna().all()\nassert df[\"case_id\"].is_unique", "Uniqueness alone does not rule out a single missing key."),
card("sql-select-where", "sql-basics", "SQL", "Select case_id and district from open requests.", "requests(case_id, district, status)", "", "SELECT case_id, district\nFROM requests\nWHERE status = 'open';", ""),
card("sql-null", "sql-basics", "SQL", "Select requests whose closed_at value is NULL.", "requests(case_id, closed_at)", "", "SELECT * FROM requests WHERE closed_at IS NULL;", "NULL is tested with IS NULL, not = NULL."),
card("sql-count-null", "sql-basics", "SQL", "A table has 100 rows and 20 NULL costs. What do COUNT(*) and COUNT(cost) return?", "", "COUNT(*) returns 100. COUNT(cost) returns 80.", "", ""),
card("sql-group-having", "sql-basics", "SQL", "Show districts with at least 10 requests.", "requests(case_id, district)", "", "SELECT district, COUNT(*) AS n\nFROM requests\nGROUP BY district\nHAVING COUNT(*) >= 10;", "WHERE filters rows before grouping; HAVING filters groups."),
card("sql-left-join", "sql-basics", "SQL", "Keep every request and attach its district name, matching on district_id.", "requests(case_id, district_id)\ndistricts(district_id, name)\nThe lookup has one row per district_id.", "", "SELECT r.case_id, d.name\nFROM requests AS r\nLEFT JOIN districts AS d\nON r.district_id = d.district_id;", ""),
card("sql-top-counts", "sql-basics", "SQL", "Return the five categories with the most requests; break count ties alphabetically.", "requests(case_id, category)", "", "SELECT category, COUNT(*) AS n\nFROM requests\nGROUP BY category\nORDER BY n DESC, category ASC\nLIMIT 5;", ""),
card("unit-of-observation", "explore-a-new-dataset", "Analysis", "A table has one row per service request. Can its row count be described as the number of residents?", "", "No. One resident can submit several requests, and some residents submit none. Identify the unit of each row before naming a count.", "", ""),
card("denominator-observed", "summaries-and-grouping", "Analysis", "Of 100 respondents, 20 report taking the bus and 10 have missing mode. What share of respondents with a known mode take the bus?", "", "20 / 90, or about 22.2%.", "", "Report the denominator and the 10 missing responses. A share of all respondents uses a different denominator."),
card("median-outliers", "summaries-and-grouping", "Analysis", "Most commute costs are near $30, but one is $900. Which is less affected by that extreme value: mean or median?", "", "The median.", "", "Check whether $900 is an error or a valid observation before deciding how to summarize it."),
card("weighted-share", "public-data-and-survey-weights", "Analysis", "How do you calculate a survey-weighted proportion for a binary indicator?", "", "Sum weight × indicator, then divide by the sum of weights for respondents with an observed indicator.", "", "Use the appropriate survey weights and the same eligible respondents in numerator and denominator. Complex survey uncertainty requires the survey design."),
card("selection-bias", "public-data-and-survey-weights", "Analysis", "Can comments collected from a transit forum establish what all city residents think about transit?", "", "No. Forum users and people who post may differ from other residents. Describe the observed posts and the limits of the sample.", "", ""),
card("negation-cleaning", "stop-words-and-preprocessing-choices", "Analysis", "What meaning is lost if preprocessing changes \"not reliable\" to \"reliable\"?", "", "The negative judgment becomes a positive one.", "", "Check whether stop-word removal deletes negation before interpreting sentiment or topic features."),
card("tfidf-meaning", "word-counts-and-tf-idf", "Analysis", "Does a high TF-IDF weight tell you that an author supports a topic?", "", "No. It means the term is prominent in that document relative to its prevalence in the fitted corpus. Read the text to interpret its use.", "", ""),
card("cluster-interpretation", "similarity-and-clustering", "Analysis", "What should you inspect before naming a cluster of documents?", "", "Read several documents, including less typical examples. Compare them with documents in other clusters and check whether the label fits.", "", "Cluster membership depends on the text representation and model settings."),
card("accuracy-baseline", "evaluate-predictions", "Analysis", "A classifier is 90% accurate when 90% of examples are negative. What baseline should you compare it with?", "", "Always predicting negative also gives 90% accuracy.", "", "Inspect errors by class to see whether the classifier detects positive cases."),
card("small-cell-privacy", "protect-people-s-privacy", "Analysis", "Why can a table with no names still reveal personal information when a subgroup has one person?", "", "The subgroup label may identify that person, allowing readers to infer their response.", "", "Review combinations of attributes and external information. Aggregate or suppress risky detail under the applicable data-sharing rules.")
];
export const cardIds=new Set(flashcards.map(c=>c.id));
const DAY=86400000;
export function reviewOptions(previous){
  const days=previous?.intervalDays||0;
  return [
    {grade:'again',label:'Again',days:1/1440},
    {grade:'hard',label:'Hard',days:days<1?10/1440:Math.min(365,Math.ceil(days*1.2))},
    {grade:'good',label:'Good',days:days<1?1:Math.min(365,Math.ceil(days*2))},
    {grade:'easy',label:'Easy',days:days<1?4:Math.min(365,Math.ceil(days*3))}
  ];
}
export function scheduleReview(previous,grade,now=new Date()){
  const option=reviewOptions(previous).find(o=>o.grade===grade);
  if(!option)throw new Error('Invalid review rating');
  return {intervalDays:grade==='again'?0:option.days,dueAt:new Date(now.getTime()+Math.round(option.days*DAY)).toISOString(),updatedAt:now.toISOString(),reviews:(previous?.reviews||0)+1,grade};
}
export function intervalLabel(days){return days<1?`${Math.round(days*1440)} min`:`${days} ${days===1?'day':'days'}`;}
export function availableCards({week,scope='covered',deck='all',skill=null}){
  return flashcards.filter(c=>(!skill||c.skill===skill)&&(deck==='all'||c.deck===deck)&&(scope==='all'||skills.find(s=>s.id===c.skill).releaseWeek<=week));
}
export function dueCards(cards,reviews,now=new Date()){
  return cards.filter(c=>!reviews[c.id]||Date.parse(reviews[c.id].dueAt)<=now.getTime()).sort((a,b)=>{
    const x=reviews[a.id],y=reviews[b.id];
    return x&&y?Date.parse(x.dueAt)-Date.parse(y.dueAt):x?-1:y?1:0;
  });
}
export function validateCardReviews(raw={}){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Invalid flashcard backup.');
  const result={};
  for(const [id,r] of Object.entries(raw)){
    if(!cardIds.has(id))continue;
    if(!r||!Number.isFinite(r.intervalDays)||r.intervalDays<0||r.intervalDays>365||!Number.isInteger(r.reviews)||r.reviews<1||r.reviews>1000000||!['again','hard','good','easy'].includes(r.grade)||!Number.isFinite(Date.parse(r.dueAt))||!Number.isFinite(Date.parse(r.updatedAt)))throw new Error('Invalid flashcard review.');
    result[id]={intervalDays:r.intervalDays,reviews:r.reviews,grade:r.grade,dueAt:r.dueAt,updatedAt:r.updatedAt};
  }
  return result;
}
