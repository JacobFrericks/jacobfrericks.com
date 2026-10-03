// Tools grouped by discipline. Every tool on a project card must also appear here (tests check it).
export interface ToolGroup {
  label: string;
  tools: string[];
}

export const toolbox: { title: string; groups: ToolGroup[] }[] = [
  {
    title: "DevOps",
    groups: [
      { label: "CI/CD", tools: ["GitHub Actions", "CircleCI", "Concourse", "Jenkins"] },
      { label: "Platform", tools: ["Kubernetes", "GKE", "Argo CD", "k3s", "Docker"] },
      { label: "Cloud & source", tools: ["GCP", "AWS", "GitHub EMU", "JFrog Artifactory"] },
      { label: "Languages", tools: ["Python", "Java", "TypeScript"] },
    ],
  },
  {
    title: "DevSecOps",
    groups: [
      { label: "Signing & provenance", tools: ["Sigstore", "cosign", "SLSA", "SBOM"] },
      { label: "Images & updates", tools: ["Distroless", "Renovate", "Dependabot", "Trivy"] },
      { label: "Scanning", tools: ["Semgrep", "Gitleaks", "zizmor", "OpenSSF Scorecard"] },
      { label: "Access & network", tools: ["IAP", "Service account rotation", "Cilium"] },
    ],
  },
];
