import Marquee from "react-fast-marquee";

export function TopBar({ broadcastItems }: { broadcastItems: string[] }) {
  if (!broadcastItems || broadcastItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white text-dark p-4">
      <Marquee
        style={{ backgroundColor: "white" }}
        autoFill={false}
        speed={50}
        pauseOnHover={true}
        gradient={false}
        className="text-md"
      >
        {broadcastItems.map((item, index) => (
          <span key={index} className="mx-200">
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
