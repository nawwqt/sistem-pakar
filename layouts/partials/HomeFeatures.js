import { markdownify } from "@lib/utils/textConverter";
import Image from "next/image";

const HomeFeatures = ({ feature }) => {
  return (
    <section className="section bg-theme-light">
      <div className="container">
        <div className="text-center">
          <h2>{markdownify(feature.title)}</h2>
        </div>
        <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {feature.features.map((item, i) => (
            <div
              className="feature-card rounded-[20px] bg-white p-6 pb-8 text-center shadow-[0px_18px_40px_rgba(112,144,176,0.08)] border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              key={`feature-${i}`}
            >
              {item.icon && (
                <Image
                  className="mx-auto"
                  src={item.icon}
                  width={44}
                  height={44}
                  alt={item.name}
                />
              )}
              <div className="mt-4">
                <h4 className="font-bold text-dark text-lg mb-2">{item.name}</h4>
                <p className="text-sm text-text leading-relaxed">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFeatures;
