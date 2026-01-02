import { useEffect } from "react";

const GoogleAd = () => {
  /*useEffect(() => {
    // Prevent multiple pushes
    try {
      if (window.adsbygoogle && window.adsbygoogle.loaded) {
        window.adsbygoogle.push({});
      } else {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.log("AdSense error", e);
    }
  }, []);*/
  useEffect(() => {
    const pushAd = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    };

    pushAd();

    // Force height every 500ms for a few seconds to override AdSense auto height
    const interval = setInterval(() => {
      const ins = document.querySelector("ins.adsbygoogle");
      if (ins) {
        ins.style.height = "210px";
        const iframe = ins.querySelector("iframe");
        if (iframe) iframe.style.height = "210px";
      }
    }, 500);

    setTimeout(() => clearInterval(interval), 5000); // stop after 5s

  }, []);

  return (
    <ins
      className="adsbygoogle"
       style={{ display: "block", width: "100%", height: "210px" }}
      data-ad-client="ca-pub-6996708698661424"
      data-ad-slot="8637042416"
      data-ad-format="square"
      data-full-width-responsive="true"
    />
  );
};

export default GoogleAd;
