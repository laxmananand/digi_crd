import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import "./feature.css";

const EachImage = ({ activeIndex }) => {
  const a = useRef(null);
  const b = useRef(null);
  const c = useRef(null);
  const d = useRef(null);
  const e = useRef(null);
  const f = useRef(null);
  const previousImage = useRef({});
  // Function to track coordinates in real-time
  function trackCoordinates(name, activeIndex) {
    var icon = document.getElementById(name);
    var iconPosition = icon.getBoundingClientRect();
    var x = iconPosition.left;
    var y = iconPosition.top;

    if (name in previousImage.current) {
      // document.body.removeChild(previousImage[name]);
      const img = previousImage.current[name];
      img.style.left = x - 12 + "px";
      img.style.top = y - 12 + "px";
    } else {
      let img = document.createElement("img");
      img.src = "/v2/carousel/" + (activeIndex + 1) + "/" + name + ".svg"; // Path to your image
      img.alt = "icon";
      img.className = name;
      img.width = 35;
      img.style.position = "absolute";
      img.style.left = x - 12 + "px";
      img.style.top = y - 12 + "px";
      document.body.appendChild(img);
      previousImage.current = { ...previousImage.current, [name]: img };
    }
  }

  useEffect(() => {
    clearInterval(a.current);
    clearInterval(b.current);
    clearInterval(c.current);
    clearInterval(d.current);
    clearInterval(e.current);
    clearInterval(f.current);

    for (let object of Object.keys(previousImage.current)) {
      if (previousImage.current[object]) {
        document.body.removeChild(previousImage.current[object]);
      }
    }

    previousImage.current = {};

    a.current = setInterval(() => {
      trackCoordinates("icon1", activeIndex);
    }, 10); // Change 1000 to adjust the interval in milliseconds
    b.current = setInterval(() => {
      trackCoordinates("icon2", activeIndex);
    }, 10); // Change 1000 to adjust the interval in milliseconds
    c.current = setInterval(() => {
      trackCoordinates("icon3", activeIndex);
    }, 10); // Change 1000 to adjust the interval in milliseconds
    d.current = setInterval(() => {
      trackCoordinates("icon4", activeIndex);
    }, 10); // Change 1000 to adjust the interval in milliseconds
    if (activeIndex === 1 || activeIndex === 3) {
      e.current = setInterval(() => {
        trackCoordinates("icon5", activeIndex);
      }, 10); // Change 1000 to adjust the interval in milliseconds
      f.current = setInterval(() => {
        trackCoordinates("icon6", activeIndex);
      }, 10); // Change 1000 to adjust the interval in milliseconds
    }
    return () => {
      for (let object of Object.keys(previousImage.current)) {
        if (previousImage.current[object]) {
          document.body.removeChild(previousImage.current[object]);
          previousImage.current[object] = null;
        }
      }
      previousImage.current = {};

      clearInterval(a.current);
      clearInterval(b.current);
      clearInterval(c.current);
      clearInterval(d.current);
      clearInterval(e.current);
      clearInterval(f.current);
    };
  }, [activeIndex]);

  // Call the function at regular intervals (e.g., every second)

  return (
    <div className="container w-100 mx-auto d-flex h-100 position-relative mb-5">
      <div className="wrap d-flex mx-auto  position-relative">
        <div
          className={`circle horizontal${
            activeIndex === 1 || activeIndex === 3 ? "2" : ""
          } border-0`}
          style={{
            background:
              "linear-gradient(white, rgb(167, 166, 166), black, rgb(114, 114, 114), rgb(176, 176, 176))",
          }}
        >
          <div
            className="bg-light-primary w-100 h-100 circle border-0"
            style={{ transform: "scale(0.99)" }}
          >
            <div className="wrap-electron">
              <div className="circle electron border-0 d-flex align-items-center justify-content-center p-3 bg-transparent">
                <span id="icon1" />
              </div>
            </div>
            <div className="wrap-electron2">
              <div
                className="circle electron border-0 d-flex align-items-center justify-content-center p-3 bg-transparent"
                style={{ backgroundColor: "yellow" }}
              >
                <span id="icon2" />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`circle vertical${
            activeIndex === 1 || activeIndex === 3 ? "2" : ""
          } border-0`}
          style={{
            background:
              "linear-gradient(rgb(216, 213, 213), black, black, black, rgb(215, 206, 206))",
          }}
        >
          <div
            className="bg-light-primary w-100 h-100 circle border-0"
            style={{ transform: "scale(0.99)" }}
          >
            <div className="wrap-electron">
              <div className="circle electron border-0 d-flex align-items-center justify-content-center p-3 bg-dark text-white bg-transparent">
                <span id="icon3" />
              </div>
            </div>
            <div className="wrap-electron2">
              <div className="circle electron border-0 d-flex align-items-center justify-content-center p-3 bg-transparent">
                <span id="icon4" />
              </div>
            </div>
          </div>
        </div>
        {(activeIndex === 1 || activeIndex === 3) && (
          <div
            className="circle diagonal border-0"
            style={{
              background:
                "linear-gradient(rgb(216, 213, 213), rgb(168, 164, 164), rgb(26, 26, 26), rgb(84, 83, 83), rgb(215, 206, 206))",
            }}
          >
            <div
              className="bg-light-primary w-100 h-100 circle border-0"
              style={{ transform: "scale(0.99)" }}
            >
              <div className="wrap-electron">
                <div className="circle electron border-0 d-flex align-items-center justify-content-center p-3 bg-dark text-white bg-transparent">
                  <span id="icon5" />
                </div>
              </div>
              <div className="wrap-electron2">
                <div className="circle electron border-0 d-flex align-items-center justify-content-center p-3 bg-transparent">
                  <span id="icon6" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <img
        width="86x"
        className="position-absolute"
        style={{ top: "45%", left: "45%" }}
        alt="logo"
        src="/logo_new.svg"
      />
    </div>
  );
};

const CarouselItem = ({ idx, data, active = false }) => {
  return (
    <div className={"carousel-item " + (active ? "active" : "")}>
      <div className="illustration-parent w-100 d-flex justify-content-center align-item-center">
        <div className="transact-across-190countries-wrapper">
          <h1 className="transact-across-190countries">{data?.title}</h1>
        </div>
        <div className="inputs">
          <div className="benefit-from-local">{data?.subtitle}</div>
        </div>
      </div>
    </div>
  );
};

export const FeaturesComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    //dispatch(setShowSidebar(false))
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const carousel = useRef(null);

  const intervalRef = useRef(null);

  useEffect(() => {
    const inner = () => {
      const activeItem = carousel.current?.querySelector(
        ".carousel-item.active"
      );
      const index = Array.from(
        carousel.current?.querySelectorAll(".carousel-item") || []
      ).indexOf(activeItem);
      setActiveIndex(index);
    };
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(inner, 500);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [carousel.current]);

  const zoqqFeatures = [
    {
      title: "Сombined power of GEMS",
      subtitle:
        "Enter Zoqq - designed exclusively for businesses that aim for agility, adaptability, and accuracy in their financial maneuvers. Experience the combined power of GEMS with Zoqq.",
    },
    {
      title: "Global Banking (G)",
      subtitle:
        "Transact across 190+ countries with Zoqq's global multicurrency account. Benefit from local accounts in prominent currencies and enjoy industry-leading low FX fees.",
    },
    {
      title: "Expense Management (E)",
      subtitle:
        "Automated invoice and bill payments, integrations with major accounting platforms, and corporate expense cards for streamlined financial workflows.",
    },
    {
      title: "Modular Branding (M)",
      subtitle:
        "Make Zoqq truly yours. Customize themes, employ AI-driven branding solutions, and host on a domain of your choice, all while enhancing user experience seamlessly.",
    },
    {
      title: "Self Service (S)",
      subtitle:
        "Onboard digitally, sign MSAs online, and pay only for what you need with our transparent subscription model.",
    },
  ];

  return (
    <div className="features">
      {/* <div className="slide-dots-wrapper">
        <div className="slide-dots">
          <div className="oval"></div>
          <div className="oval1"></div>
          <div className="oval2"></div>
          <div className="oval3"></div>
        </div>
      </div> */}

      <div className="position-relative w-100">
        <EachImage activeIndex={activeIndex} />
      </div>

      <div
        id="carouselExampleAutoplaying"
        className="carousel slide w-100"
        data-bs-ride="carousel"
        data-bs-interval={3000}
        ref={carousel}
      >
        {zoqqFeatures?.map((item, idx) => (
          <CarouselItem key={idx} active={idx === 0} idx={idx} data={item} />
        ))}
      </div>

      <div className="slide-dots-wrapper">
        <div className="slide-dots">
          {zoqqFeatures?.map((item, idx) => (
            <div className={activeIndex === idx ? "oval" : "oval1"}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesComponent;
