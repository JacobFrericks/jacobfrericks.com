// The six links of the software supply chain, each with a real attack and the work that protects it.
export interface Control {
  what: string;
  where: string;
}

export interface Link {
  id: string;
  name: string;
  risk: string;
  attack: string;
  attackText: string;
  controls: Control[];
  inProgress?: boolean;
}

const F10 = "Fortune 10 healthcare company";
const HOME = "My home server";

export const links: Link[] = [
  {
    id: "source",
    name: "Source",
    risk: "Someone pushes code they should not. One stolen token is enough.",
    attack: "PHP source server (2021)",
    attackText: "Attackers pushed backdoored commits to PHP's git server under the names of real maintainers.",
    controls: [
      { what: "Run GitHub Enterprise (EMU) and GitHub Actions", where: `Tech lead · ${F10}` },
      { what: "Automatic service account rotation", where: "Principal Financial Group" },
    ],
  },
  {
    id: "deps",
    name: "Deps",
    risk: "You run code you did not write and did not read.",
    attack: "xz-utils backdoor (2024)",
    attackText: "A trusted maintainer slipped a backdoor into a compression library that SSH depends on.",
    controls: [
      { what: "Distroless base images for every developer", where: F10 },
      { what: "JFrog Artifactory as the artifact source", where: F10 },
      { what: "Weekly Renovate and Trivy update PRs", where: HOME },
    ],
  },
  {
    id: "build",
    name: "Build",
    risk: "The build system changes the output and nobody sees it.",
    attack: "SolarWinds (2020)",
    attackText: "Malware planted in the build system was signed and shipped to about 18,000 customers.",
    controls: [
      { what: "SLSA Build L3 pipeline (in progress)", where: `Tech lead · ${F10}` },
      { what: "Reusable security workflows for GitHub Actions", where: `Main designer · ${F10}` },
      { what: "Security Orb for CircleCI", where: F10 },
    ],
    inProgress: true,
  },
  {
    id: "artifact",
    name: "Artifact",
    risk: "The image you deploy is not the image you built.",
    attack: "Tag swapping",
    attackText: "A mutable tag like :latest gets repointed to a different image after review.",
    controls: [
      { what: "SBOM and cosign attestations on every container", where: F10 },
      { what: "Every image pinned by sha256 digest, enforced in CI", where: HOME },
    ],
  },
  {
    id: "deploy",
    name: "Deploy",
    risk: "Someone changes what runs in the cluster by hand.",
    attack: "Out-of-band changes",
    attackText: "A direct kubectl edit skips review and leaves no trace in git.",
    controls: [
      { what: "Reusable CD workflows into Argo CD on GKE", where: F10 },
      { what: "GitOps with Argo CD on k3s", where: HOME },
    ],
  },
  {
    id: "runtime",
    name: "Runtime",
    risk: "One weak service or exposed app reaches everything else.",
    attack: "Container escape",
    attackText: "A container with a shell, root, and host access breaks out to the node.",
    controls: [
      { what: "Distroless images: no shell, no package manager", where: F10 },
      { what: "Identity-Aware Proxy in front of apps", where: "Principal Financial Group" },
      { what: "Cilium networking", where: HOME },
    ],
  },
];

export const defaultLink = "build";
