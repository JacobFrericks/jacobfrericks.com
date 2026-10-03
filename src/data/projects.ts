// Project cards. Each one is tagged with the chain link it protects (an id from chain.ts).
export type Status = "shipped" | "in-progress" | "personal";

export interface Project {
  link: string;
  title: string;
  where: string;
  status: Status;
  problem: string;
  fix: string;
  result: string;
  tools: string[];
}

const F10 = "Fortune 10 healthcare company";

export const projects: Project[] = [
  {
    link: "build",
    status: "in-progress",
    title: "SLSA Build L3 pipeline",
    where: `${F10} · 2026 – now · Tech lead`,
    problem: "Builds could not prove where an artifact came from or that nothing changed it on the way.",
    fix: "Leading a new GitHub Actions build pipeline that produces signed provenance on an isolated builder.",
    result: "In progress. Target: SLSA Build Level 3.",
    tools: ["GitHub Actions", "Sigstore", "SLSA"],
  },
  {
    link: "source",
    status: "shipped",
    title: "GitHub & Actions platform",
    where: `${F10} · 2026 – now · Tech lead`,
    problem: "Source control and CI for the whole company need one owner and one set of rules.",
    fix: "Lead the team that administers GitHub Enterprise (EMU) and GitHub Actions.",
    result: "One managed home for code and pipelines, with accounts tied to company identity.",
    tools: ["GitHub EMU", "GitHub Actions"],
  },
  {
    link: "build",
    status: "shipped",
    title: "Security workflows for GitHub Actions",
    where: `${F10} · 2024 – now · Main designer`,
    problem: "Each team wired up security scanners on its own, or not at all.",
    fix: "Designed and built most of the reusable workflows that run security tools and attest the results.",
    result: "Security scanning is part of the default path, not extra work.",
    tools: ["GitHub Actions", "Python"],
  },
  {
    link: "build",
    status: "shipped",
    title: "Security Orb",
    where: `${F10} · 2022 – 2024 · Creator`,
    problem: "Teams on CircleCI had no shared way to run security tools and keep the results.",
    fix: "Built the Security Orb: reusable Python code that connects security tools and attests their results.",
    result: "CircleCI teams got the secure path without writing glue code.",
    tools: ["CircleCI", "Python"],
  },
  {
    link: "artifact",
    status: "shipped",
    title: "SBOM + cosign attestation",
    where: `${F10} · 2022 – 2024`,
    problem: "Nobody could prove what was inside a container or which checks it passed.",
    fix: "Built a pipeline that generates an SBOM and attaches signed attestations to each image with cosign.",
    result: "Any image can be checked for its contents and scan results before deploy.",
    tools: ["cosign", "SBOM", "Docker"],
  },
  {
    link: "deps",
    status: "shipped",
    title: "Distroless base images",
    where: `${F10} · 2022 – 2024`,
    problem: "Full OS base images ship shells and packages apps never use, and each one brings CVEs.",
    fix: "Built and maintained distroless base images as the standard base for every developer in the company.",
    result: "Smaller images, a smaller attack surface, and one place to patch.",
    tools: ["Distroless", "Docker"],
  },
  {
    link: "deploy",
    status: "shipped",
    title: "Reusable CD to Argo CD",
    where: `${F10} · 2024 – 2026`,
    problem: "Every team built its own path to Kubernetes.",
    fix: "Helped build and maintain reusable GitHub Actions CD workflows that hand off to Argo CD clusters on GKE.",
    result: "Deploys flow through git and one reviewed path.",
    tools: ["GitHub Actions", "Argo CD", "GKE"],
  },
  {
    link: "runtime",
    status: "shipped",
    title: "Service account rotation + IAP",
    where: "Principal Financial Group · 2017 – 2020",
    problem: "Long-lived service account keys, and apps protected only by network location.",
    fix: "Built a pipeline that rotates service accounts automatically and put Identity-Aware Proxy in front of apps.",
    result: "Keys expire on a schedule, and access checks who you are, not where you are.",
    tools: ["GCP", "IAP", "CircleCI"],
  },
  {
    link: "artifact",
    status: "personal",
    title: "My home server",
    where: "Personal · ongoing",
    problem: "Even a home server pulls new code from the internet every week.",
    fix: "k3s with Argo CD GitOps. Every image pinned by digest with a CI gate. Weekly Renovate and Trivy PRs. Cilium networking. Offsite backups.",
    result: "Nothing runs unless it is pinned, reviewed, and in git. Restore from offsite is tested.",
    tools: ["k3s", "Argo CD", "Renovate", "Trivy", "Cilium"],
  },
];
