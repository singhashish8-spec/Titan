# TITAN Project — Complete Project Context & Chat Summary

*AI handoff document, prepared August 2026. Converted from the original `TITAN_Complete_Project_Handoff.docx`. This is the fuller, original, unscoped vision — kept verbatim for reference. See `docs/ROADMAP.md` for what is actually being built.*

## 1. Project Vision
Titan is intended to be a personal AI operating system / AI command center, initially built for Android. The goal is not another chatbot. Titan should become a central interface through which the user can access and orchestrate multiple AI models, personal data, files, apps, tools, and workflows.

## 2. Core Problem
The user's AI ecosystem includes ChatGPT, Claude, Gemini, Google Drive and potentially other services. These systems are disconnected, forcing manual model selection, file movement and workflow management. Titan is intended to remove this fragmentation.

## 3. Core Concept
Titan sits above multiple AI providers and data/tool sources. The user interacts primarily with Titan, while Titan determines which model, data source or tool is appropriate for a task.

## 4. Multi-AI Orchestration
Supported/target AI providers include OpenAI GPT, Anthropic Claude and Google Gemini. Titan should eventually choose the appropriate model automatically rather than requiring manual selection for every task.

## 5. AI Router
Conceptual pipeline: User request → intent detection → task classification → determine required capabilities → choose model(s) → execute → combine/validate → return result. Routing can begin with rules and model metadata and become more intelligent over time.

## 6. Real-Time Usage Awareness
Titan should eventually know which AI is being used, usage/token/quota state, cost, latency and availability. This is particularly relevant because the user has limited Claude usage and wants to use resources strategically.

## 7. Account Connections
Titan should use official APIs, OAuth and secure integrations rather than storing user passwords. Target integrations include OpenAI, Anthropic, Google/Gemini, Google Drive and eventually other services.

## 8. Google Drive / Remote Access
Google Drive is especially important. The user wants remote access and wants the phone to be sufficient for accessing data. Titan should eventually find, retrieve, process and save documents and project information in cloud storage.

## 9. Memory System
Titan should have persistent, controllable memory for useful user/project information. Conceptual flow: conversation → important information extraction → memory store/index → relevant memory retrieval → AI context. The system should distinguish temporary context, useful long-term memory, project memory and sensitive data.

## 10. Project-Based Organization
Titan should organize work into project spaces containing conversations, documents, files, decisions, AI outputs, code and project memory.

## 11. UI Concept
The UI should feel like a command center rather than a clone of ChatGPT. Possible home screen: Titan greeting, Ask Titan input, recent projects and AI/tool status. Other areas include chat workspace, project workspace and future agent workspace.

## 12. Agent Concept
Future specialized agents may include Coding, Research, Architecture, Document, Personal Assistant and Planning agents. Titan acts as coordinator. Agents are a future capability, not an MVP requirement.

## 13. Android-First Direction
The intended first client is Android using Kotlin, Jetpack Compose and Android Studio. The phone should provide access to Titan, AI, projects and remote data. A PC companion may come later.

*(Superseded by decision: Titan v0.1 uses Capacitor + Ionic + React, not native Kotlin — see `docs/DECISIONS.md`.)*

## 14. Backend Concept
A backend will eventually handle authentication, AI routing, memory, task execution, project state, integrations and secure server-side operations. The exact backend stack was not finalized.

## 15. Data Storage
Relational storage such as PostgreSQL can hold users, projects, tasks and integrations. A vector database such as Pinecone, Weaviate or Chroma was considered conceptually for semantic memory/search. The exact database was not finalized.

## 16. Security
Titan may eventually access personal data, so security is critical. Use OAuth, scoped permissions, encryption, secure token handling and minimal access. The user should control which services Titan can access.

## 17. Local vs Cloud
The user does not want an offline-only system. The intended architecture is hybrid: Android for UI and local capabilities, cloud services for backend, memory, orchestration and integrations, with local processing where practical.

## 18. Cost Constraints
The user is salaried, not a full-time developer and does not want large upfront spending. Titan should be developed incrementally and avoid unnecessary paid infrastructure or redundant AI API costs.

## 19. User's Development Workflow
The user is not a full-time developer/tech specialist and prefers practical, step-by-step guidance. AI should do substantial implementation work, explain important decisions, avoid unnecessary complexity and maintain project history.

## 20. AI-Assisted Workflow
The user uses ChatGPT for coding, reasoning and research; Claude selectively because of token limitations; and Gemini to outsource tasks and accelerate workflow. Titan should be designed around multiple providers rather than one model.

## 21. AI-Model-Agnostic Architecture
Titan should use an abstraction/provider interface so OpenAI, Anthropic, Google and future providers can be added or removed without rewriting the entire system.

*(This became the "plug" pattern in the scoped v0.1 spec — see `docs/ARCHITECTURE.md`.)*

## 22. API vs Consumer Subscriptions
Consumer subscriptions and developer APIs are different. A ChatGPT, Claude or Gemini subscription does not automatically mean Titan can use that provider programmatically. Integration architecture must respect each provider's official API/authentication rules.

## 23. Example Future Workflow
A future request could be: find a project on Drive, analyse it, compare it with a previous version, summarize changes and prepare a report. Titan would locate data, determine file type, choose appropriate models/tools, execute the workflow, generate the report and save it.

## 24. Real-Time Feedback
Titan should provide visible progress for multi-step tasks, e.g. finding project, opening document, selecting model, analysing, generating report. The user should not feel that the app has frozen.

## 25. Transparency
Titan should eventually show useful information such as selected AI, task progress, data source and usage information without overwhelming the user.

## 26. History and Versioning
The user explicitly values preserving versions, changes, errors and conversations. Project documentation should capture what was built, why, what changed, what failed and what comes next.

## 27. Git Workflow
The user prefers a professional Git workflow with branches such as `main`, `develop` and `feature/*` or `bugfix/*`, meaningful commits and preserved history.

## 28. AI Handoff Requirement
Because the user works across GPT, Claude and Gemini, Titan must be transferable between AIs. Maintain explicit documentation such as `PROJECT_CONTEXT.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `DECISIONS.md`, `CHANGELOG.md`, `ERROR_LOG.md` and `AI_HANDOFF.md`.

## 29. Original Project Before Titan
Before Titan, the user considered a premium expense/budget application with expense tracking, budgets, EMI tracking, multiple bank accounts and reading phone notifications/RCS messages from banks. The concept evolved into the broader Titan platform.

## 30. Why Titan Became a Studio
The user wanted Titan to be a base/platform from which many future capabilities and applications could be developed, rather than a single-purpose application.

## 31. Important Project Separation
ArchitectAR is a separate project from Titan. Titan is the multi-AI personal operating system. ArchitectAR is the Android architecture AR application. Do not merge their project histories.

## 32. ArchitectAR Context (Separate Project)
ArchitectAR uses Android Studio, Kotlin, Jetpack Compose, ARCore and SceneView. Its intended architectural/BIM source is Revit, not Rhino. Recent work included ARCore 1.54.0, SceneView 2.2.1, a version catalog, manifest camera/AR configuration, ARScreen.kt and camera permission handling.

## 33. ArchitectAR Git History (Separate Project)
The ArchitectAR repository was referenced as `singhashish8-spec/Architect-AR`. The user authenticated with GitHub via SSH, pushed main, created develop, pushed develop and created feature/arcore-foundation. This belongs to ArchitectAR, not Titan.

## 34. ArchitectAR Current Foundation Test (Separate Project)
The current ARCore foundation test asks Gemini to verify ARCore session initialization, plane detection, horizontal plane detection, temporary white cube placement on tap and debug messages. Again, this is ArchitectAR, not Titan.

## 35. What a New Titan AI Should Do
Understand the existing vision first; preserve decisions; explain tradeoffs; avoid unnecessary complexity; respect the cost constraint; maintain documentation; use AI models strategically; and preserve project history.

## 36. What a New Titan AI Should NOT Do
Do not treat Titan as a simple chatbot, assume one AI must do everything, build a huge backend before an MVP, require the user to become a professional developer, store AI-provider passwords, assume consumer subscriptions equal API access, or mix ArchitectAR into Titan.

## 37. Recommended Titan Build Sequence
1) Freeze vision. 2) Define smallest useful MVP. 3) Define technical architecture. 4) Establish Git/documentation. 5) Build Android shell. 6) Connect one AI provider. 7) Make end-to-end task/chat work. 8) Add second provider. 9) Build AI router. 10) Add Google Drive. 11) Add project/memory system. 12) Add agents and automation.

## 38. Ultimate Titan Definition
Titan is intended to be a personal AI operating system that sits above multiple AI models, tools, services, files and personal data, intelligently choosing and orchestrating the right resources to accomplish a user's task.

## 39. Handoff Instruction for Another AI
You are joining the Titan project as a senior AI product architect and implementation partner. Treat this document as the project's baseline context. Do not redesign the idea from scratch unless a documented decision is being challenged. Help turn the vision into a practical architecture, UI, database, integration plan and incremental implementation. Preserve decisions, costs, Git history, errors and handoff documentation.

## Key Project Distinction
**TITAN** = multi-AI personal operating system / orchestration platform.
**ARCHITECTAR** = separate Android architecture AR application using ARCore + SceneView, with Revit as the intended BIM source.
