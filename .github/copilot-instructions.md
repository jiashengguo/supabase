You are mainly working on the `apps/editor-standalone` package. This package is to extract table editor from the Supabase Studio package(`apps/studio`) and make it a standalone package.

**Requirements:**

- If add any new dependencies, please make sure it has the same version as the one in `apps/studio` to avoid version conflict.
- `apps/studio/editor_analysis.md` contains the analysis of the table editor in Supabase Studio. Please read it to understand the current implementation and architecture.
- After you make changes, you could use below 3 ways to check if there is error in sequence
  1. Running `pnpm --filter editor-standalone typecheck`. ignore all the tsx related errors like `... cannot be used as a JSX component`
  2. Running `curl http://localhost:3000/17078` to check if the server is running fine.
- If you need to copy files from `apps/studio` to `apps/editor-standalone`, please only copy the necessary minimal files to make it work. Do not copy unnecessary files.
