# Week 11: cloud runtimes and reproducibility

Use this guide with `week11_live_workspace.ipynb`. Last week we evaluated model output. This week we ask where the work ran and what another person would need to run it again.

Official links and time-sensitive notes below were checked on **August 21, 2026**. Cloud hardware, model availability, prices, and quotas can change; verify them again before relying on them.

## Three execution models

| Mode | Where Python runs | Where model inference runs | Typical state | Main boundary |
|---|---|---|---|---|
| Local Jupyter | Your computer | Your computer, if a local model is used | Persists until you change or delete it | Local files, local hardware, local environment |
| Google Colab | A hosted virtual machine | The Colab VM for an open-weight model | Temporary runtime; notebook may persist separately in Drive | Code/data move to Google's hosted runtime |
| Gemini API | Local or Colab client | Google's managed Gemini service | Service and model can change independently of your notebook | Prompt/data leave the client and are sent to the API |

Neither local nor Colab is universally better. Local work gives you durable state and more control; Colab gives the class a shared hosted notebook surface and possible accelerator access. The correct choice depends on the task, data rules, hardware, and handoff needs.

## What survives a Colab reset?

| Item | Usually survives `Disconnect and delete runtime`? | What to do |
|---|---:|---|
| Notebook saved in Drive | Yes | Save before resetting |
| File created under `/content` | No | Re-create or download it from a documented source |
| Package installed only in the current runtime | No | Put a pinned install command in the bootstrap section |
| Python variables and imported modules | No | Run the notebook from the first cell |
| File stored in mounted Drive | Yes | Document its location and access rules |
| Colab user secret | Stored outside the notebook | Re-authorize notebook access when required; never display the value |

Google states that Colab virtual machines are deleted after inactivity and have a maximum lifetime. GPU types, availability, and usage limits are dynamic rather than guaranteed. See the [official Colab FAQ](https://research.google.com/colaboratory/faq.html).

## Evidence that a GPU was actually used

Selecting a GPU runtime is not enough. Record evidence:

1. `torch.cuda.is_available()` is `True`.
2. Record the GPU name and memory, without assuming a particular model in advance.
3. Show the input tensor's device.
4. Show the model parameter device: `next(model.parameters()).device`.
5. Synchronize CUDA before and after timing: `torch.cuda.synchronize()`.
6. Report the comparison honestly. For a small job, setup and transfer can make a GPU slower.

## Minimum environment manifest

A reproducible handoff records at least:

- execution mode and timestamp;
- Python and relevant package versions;
- operating system/runtime identity;
- CPU/GPU availability and GPU name when present;
- model ID and task settings;
- random seed, when randomness matters;
- data source, snapshot date, and checksum or other stable identifier;
- output artifact names;
- whether the result came from a live service or a recorded fixture.

Do **not** place an API key, token, personal path, or private text in the manifest.

## Credentials and data boundaries

- Locally, read the key from `GEMINI_API_KEY` in the process environment.
- In Colab, use the Secrets panel and retrieve the value with `google.colab.userdata.get("GEMINI_API_KEY")`.
- Display only whether the secret was found, never the secret itself.
- Never commit keys to Git or paste them into a notebook cell.
- If a key is exposed, revoke or replace it and inspect usage.
- Before sending text to an API, ask: Is this data approved for this service? Does it contain personal, confidential, licensed, or operational information?

Google's current key guidance recommends environment variables or a secret manager and says new AI Studio keys use the newer authorization-key system. Review the [official Gemini API-key guidance](https://ai.google.dev/gemini-api/docs/api-key) before creating a course key.

## Cost and rate-limit checklist

- Record the exact model ID.
- Record actual input and output token counts when the response provides them.
- Count thinking tokens separately when the model reports them.
- Use a dated price snapshot; do not copy a price into a notebook and treat it as permanent.
- Check the active limits for your own project and model. Do not assume one fixed requests-per-minute number applies to everyone.
- Bound the number of documents, retries, and maximum output tokens before calling the API.
- Stop on repeated quota or service failures; do not retry indefinitely.
- Explain how a quota or budget constraint affects the data you could process and therefore the claim you can make.

Current references: [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing), [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits), and [token accounting](https://ai.google.dev/gemini-api/docs/generate-content/tokens).

## Project blocker triage

Replace "it does not work" with a record another person can act on:

```text
Blocker:
Reproduction steps:
Expected:
Observed:
Evidence:
Scope or impact:
Owner:
Next action:
Deadline:
Done when:
```

A useful `done when` field is observable: "A clean Colab runtime runs cells 1-12 without an exception and writes `results.csv` with 96 unique document IDs."

## Before handing off a cloud notebook

- Save the notebook.
- Restart or reconnect from a clean runtime and run from the top.
- Confirm setup recreates every temporary package and file.
- Record environment, data, model, and prompt evidence.
- Confirm secrets are absent from cells, outputs, filenames, and Git history.
- Label live API results and recorded fixtures distinctly.
- Name the output artifacts and explain how to verify them.
- State important limits and the strongest claim the evidence supports.
