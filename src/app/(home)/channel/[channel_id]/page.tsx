interface ChannelPageProps {
  params: Promise<{ channel_id: string; channel_name: string }>;
}

const ChannelPage = async ({ params }: ChannelPageProps) => {
  const { channel_id, channel_name } = await params;
  return (
    <div>
      This is channel with id: {channel_id} and name: {channel_name}
    </div>
  );
};

export default ChannelPage;
