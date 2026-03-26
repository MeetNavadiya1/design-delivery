
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import hero from "../../assets/hero.png";
import Button from "../common/button";


const Hero = () => {
  return (
    <div className="my-container pt-10 flex flex-col md:flex-row md:justify-between items-center tracking-wide">
      <div className="w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold text-primary">
            Built for creative agencies
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6">
          Creative approvals <span className="text-primary">without</span> the
          chaos
        </h1>

        <p className="text-gray-500 leading-relaxed text-sm md:text-md lg:text-lg mb-6 max-w-130">
          Share design assets, collect precise feedback, and get binding client
          sign-offs, all in one clean platform. Say goodbye to email threads and
          missed approvals.
        </p>

        <div className="flex flex-wrap items-start gap-2 mb-6 btn-text">
          <Button className="flex items-center gap-2 px-3 py-2 md:px-6 md:py-3 bg-primary hover:bg-hover-primary text-white">
            <p>Start Free Trial</p>
            <ArrowRight size={14} className="h-5 md:h-7" />
          </Button>
          <Button className="flex items-center gap-2 px-3 py-2 md:px-6 md:py-3 border border-gray-200 bg-white hover:border-gray-300 text-black ">
            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Play size={11} className="text-primary ml-0.5" fill="#6C63FF" />
            </div>
            <span>Watch Demo</span>
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["AK", "SK", "JL", "RC", "PV"].map((init, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white ${["bg-purple-500", "bg-blue-500", "bg-green-500", "bg-orange-500", "bg-pink-500"][i]}`}
                >
                  {init}
                </div>
              ))}
            </div>
            <span className="text-xs md:text-sm md:text-md lg:text-lg">
              <b>2,000+</b> creative teams uses Design Delivery
            </span>
          </div>
        </div>
      </div>

      <div className="w-full p-10 relative">
        <div>
          <img
            src={hero}
            alt="dashboard"
            className="shadow-2xl border border-gray-200 rounded-2xl"
          />
        </div>

        <div className="inline-flex gap-2 items-center px-3 py-2.5 shadow-lg border-gray-200 rounded-2xl absolute top-5 right-0 bg-white">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-extrabold text-primary">
            AK
          </div>
          <span className="text-xs text-gray-500">"Love the new header!"</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-2.5 shadow-lg border-gray-200 rounded-2xl bg-white absolute bottom-5 left-0">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle2 size={16} className="text-green-600" />
          </div>
          <p className="text-xs text-gray-500">
            <span className="text-sm text-black font-bold">Approved!</span>
            <br />
            Homepage Hero v3
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
