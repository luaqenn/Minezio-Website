type Props = {
  guild_id: string | number;
};

export default function DiscordWidget({ guild_id }: Props) {
  return (
    <div className="relative z-10">
      <div className="sticky top-[400px] transition-all duration-300 ease-in-out">
        <iframe
          src={`https://discord.com/widget?id=${guild_id}&theme=dark`}
          width="100%"
          height="500"
          allowTransparency={true}
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          className="rounded-xl sm:rounded-2xl shadow-lg"
        ></iframe>
      </div>
    </div>
  );
}
