import config from "@config/config.json";
import theme from "@config/theme.json";
import Footer from "@layouts/partials/Footer";
import Header from "@layouts/partials/Header";
import Providers from "@layouts/partials/Providers";
import "../styles/style.scss";

export const metadata = {
  title: "BacaBisa - Sistem Pakar Skrining Disleksia (CBR)",
  description:
    "Analisis Tingkat Keparahan Disleksia (Ringan, Sedang, Berat) pada Anak Usia Sekolah Dasar menggunakan Case-Based Reasoning (CBR). Universitas Janabadra Yogyakarta.",
};

export default function RootLayout({ children }) {
  const pf = theme.fonts.font_family.primary;
  const sf = theme.fonts.font_family.secondary;
  return (
    <html suppressHydrationWarning={true} lang="id">
      <head>
        {/* responsive meta */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* favicon */}
        <link rel="shortcut icon" href={config.site.favicon} />

        {/* google font css */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href={`https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=${pf}${
            sf ? "&family=" + sf : ""
          }&family=Outfit:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Poppins:wght@400;500;600;700;800&display=swap`}
          rel="stylesheet"
        />

        <meta name="msapplication-TileColor" content="#0284c7" />
        <meta
          name="theme-color"
          content="#0284c7"
        />
      </head>
      <body suppressHydrationWarning={true} className="min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-grow">
          <Providers>{children}</Providers>
        </main>
        <Footer />
      </body>
    </html>
  );
}
