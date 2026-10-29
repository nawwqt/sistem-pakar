import { markdownify } from "@lib/utils/textConverter";
import Image from "next/image";

const Workflow = ({ workflow }) => {
  return (
    <section className="section pb-0">
      <div className="mb-8 text-center">
        {markdownify(
          workflow.title,
          "h2",
          "mx-auto max-w-[400px] font-bold leading-[44px]"
        )}
        {markdownify(workflow.description, "p", "mt-3")}
      </div>
      <div className="container max-w-[1200px] mx-auto px-4">
        <Image
          src={workflow.image}
          alt="Alur 4R Case-Based Reasoning"
          width={1200}
          height={260}
          className="w-full h-auto"
        />
      </div>
    </section>
  );
};

export default Workflow;
