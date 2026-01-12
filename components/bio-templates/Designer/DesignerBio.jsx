import DesignerBioA from "@/components/bio-templates/Designer/Varients/DesignerBioA";
import DesignerBioB from "@/components/bio-templates/Designer/Varients/DesignerBioB";
import DesignerBioC from "@/components/bio-templates/Designer/Varients/DesignerBioC";
import DesignerBioD from "@/components/bio-templates/Designer/Varients/DesignerBioD";

export default function DesignerBio({ variant = "A", bio, links }) {
  if (variant === "A") return <DesignerBioA bio={bio} links={links} />;
  if (variant === "B") return <DesignerBioB bio={bio} links={links} />;
  if (variant === "C") return <DesignerBioC bio={bio} links={links} />;
  return <DesignerBioD bio={bio} links={links} />;
}
