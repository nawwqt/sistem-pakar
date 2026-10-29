import { markdownify } from "@lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";

function Cta({ cta }) {
  return (
    <section className="section px-4">
      <div className="section container rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-slate-100 bg-white">
        <div className="row mx-auto items-center justify-center">
          <div className="md:col-5 lg:col-4">
            <div className="relative aspect-square w-full max-w-[340px] mx-auto overflow-hidden rounded-[20px] shadow-md border border-slate-100">
              <Image
                className="w-full h-full object-cover"
                src={cta?.image}
                alt={cta?.title || "call to action image"}
                width={480}
                height={480}
                priority
              />
            </div>
          </div>
          <div className="mt-6 text-center md:col-6 lg:col-5 md:mt-0 md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {cta?.title}
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              {markdownify(cta?.content)}
            </p>
            {cta.button.enable && (
              <div className="mt-6">
                <Link
                  className="btn btn-primary shadow-md hover:shadow-lg transition-all"
                  href={cta.button.link}
                  rel={cta.button.rel}
                >
                  {cta.button.label}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cta;
