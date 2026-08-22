# Lecture materials

These are the materials students can see for Monday lectures: live workspaces, readings, reference pages, setup notes, and the record produced in class. Instructor runbooks, answer keys, expected outputs, and teaching notes are stored elsewhere.

## What to expect each week

A notebook-based week has at most one active lecture notebook:

```text
lessons/
└── weekXX_topic/
    └── weekXX_live_workspace.ipynb
```

Most live notebooks start sparse on purpose. Before class they may contain imports, fixture loading, or credential-safe setup, but not the completed analysis. We write the substantive code together. After class, the notebook may be replaced with the version produced in the room; Git history keeps the original starter version.

Some weeks use a different live surface. Week 3 uses GitHub Desktop and GitHub.com, and Week 4 uses a local terminal. Those folders still contain something worth keeping open: a guide, reading, command reference, or practice fixture.

Later NLP, embedding, LLM, and cloud weeks include more setup because model and data-loading boilerplate can otherwise consume the lesson. The analytical choices still happen in class.

## Other course materials

- Practice notebooks are in `lab/`.
- Homework notebooks are in `homework/`.
- Shared cheat sheets and optional references are in `resources/`.
- Private instructor runbooks are not stored in this repository.
