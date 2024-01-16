import { useState, useEffect } from "react";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Markerposition from "./Markerposition";
import arrow from "./images/icon-arrow.svg";
import background from "./images/pattern-bg-desktop.png";

function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpaddress] = useState("");
  const checkIpAddress =
    /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const checkDomain =
    /^(?!:\/\/)(?!www\.)([a-zA-Z0-9_-]+\.){1,}([a-zA-Z]{2,})(:[0-9]+)?$/i;

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=at_UZxvjI5cNa4zzXOfrpa4S5uipEyAB&ipAddress=192.212.174.101`,
        );
        const data = await res.json();
        setAddress(data);
      };

      getInitialData(); // Call the function to fetch initial data
    } catch (error) {
      console.trace(error);
    }
  }, []);

  async function getEnteredAddress() {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_UZxvjI5cNa4zzXOfrpa4S5uipEyAB&${
        checkIpAddress.test(ipAddress)
          ? `ipAddres=${ipAddress}`
          : checkDomain.test(ipAddress)
            ? `domain=${ipAddress}`
            : ""
      }`,
    );
    const data = await res.json();
    setAddress(data);
  }
  function handleSubmit(e) {
    e.preventDefault();
    getEnteredAddress();
    setIpaddress("");
  }
  return (
    <>
      <section>
        <div className="absolute -z-10">
          <img src={background} alt="" className="w-full h-80 object-cover" />
        </div>

        <article className="p-8 ">
          <h1
            className="text-2xl text-center 
          text-white font-bold mb-8 lg:text-3xl"
          >
            IP Address Tracker
          </h1>

          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="flex justify-center max-w-xl 
            mx-auto"
          >
            <input
              type="text"
              name="ipaddress"
              id="ipaddress"
              placeholder="Search for any ip 
            Address or Domain"
              required
              value={ipAddress}
              onChange={(e) => setIpaddress(e.target.value)}
              className="py-2 px-4 rounded-l-lg w-full "
            />
            <button
              type="submit"
              className="bg-black py-4 px-4 hover:opacity-60
            rounded-r-lg"
            >
              <img src={arrow} alt="arrow" />
            </button>
          </form>
        </article>

        {address && (
          <>
            <article
              className="bg-white rounded-lg 
          shadow p-8 mx-8 grid grid-cols-1 gap-8 md:grid-cols-2
          lg:grid-cols-4 max-w-6xl xl:mx-auto text-center md:text-left 
          relative lg:-mb-16 "
              style={{ zIndex: 10000 }}
            >
              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase text-sm font-semibold text-slate-500 tracking-wider mb-3">
                  Ip Address
                </h2>
                <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  {address.ip}
                </p>
              </div>

              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase text-sm font-semibold text-slate-500 tracking-wider mb-3">
                  Location
                </h2>
                <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  {address.location.city}, {address.location.region}
                </p>
              </div>

              <div className="lg:border-r lg:border-slate-400">
                <h2 className="uppercase text-sm font-semibold text-slate-500 tracking-wider mb-3">
                  Timezone
                </h2>
                <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  UTC {address.location.timezone}
                </p>
              </div>

              <div>
                <h2 className="uppercase text-sm font-semibold text-slate-500 tracking-wider mb-3">
                  ISP
                </h2>
                <p className="font-bold text-slate-900 text-lg md:text-xl xl:text-2xl">
                  {address.isp}
                </p>
              </div>
            </article>

            <MapContainer
              center={[address.location.lat, address.location.lng]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "500px", width: "100vw" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Markerposition address={address} />
            </MapContainer>
          </>
        )}
      </section>
    </>
  );
}

export default App;
