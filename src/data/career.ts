// Career timeline, newest first. The current employer is described, never named.
export interface Role {
  start: number;
  end: number | "now";
  title: string;
  org: string;
  summary?: string;
  kind?: "education";
}

const F10 = "Fortune 10 healthcare company";

export const career: Role[] = [
  {
    start: 2026,
    end: "now",
    title: "Tech Lead, GitHub & Actions platform",
    org: F10,
    summary: "Lead the team that administers GitHub Enterprise and GitHub Actions. Building a SLSA Build L3 pipeline.",
  },
  {
    start: 2024,
    end: 2026,
    title: "Staff DevOps Engineer",
    org: F10,
    summary: "Reusable CI and CD workflows on GitHub Actions, CD to Argo CD on GKE, CircleCI optimization, Artifactory, on-call.",
  },
  {
    start: 2022,
    end: 2024,
    title: "Senior DevSecOps Engineer",
    org: F10,
    summary: "Secure CI/CD path, the Security Orb, SBOM and cosign attestation, company-wide distroless base images.",
  },
  {
    start: 2020,
    end: 2022,
    title: "Senior Cloud Security Engineer",
    org: "Hy-Vee",
    summary: "Connected developer pipelines to security tools in Concourse.",
  },
  {
    start: 2017,
    end: 2020,
    title: "Software Developer",
    org: "Principal Financial Group",
    summary: "Java and React microservices. CircleCI orbs, service account rotation, Identity-Aware Proxy.",
  },
  {
    start: 2013,
    end: 2017,
    title: "Cloud Software Engineer",
    org: "IBM",
    summary: "Java microservices. Built and ran a Jenkins server for developer pipelines.",
  },
  {
    start: 2013,
    end: 2013,
    title: "B.S. Computer Science",
    org: "Iowa State University",
    kind: "education",
  },
];
