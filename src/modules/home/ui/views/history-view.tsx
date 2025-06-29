import HistorySection from "../sections/history-section";

export const HistoryView = () => {
  return (
    <div className="max-w-[1440px] select-none overflow-hidden w-[100%] mx-auto">
      <div className="mx-2">
        <p className="text-2xl font-bold">History</p>
        <p className="text-sm text-muted-foreground">
          Your watched videos at the moment
        </p>
      </div>
      <div className="h-[1px] bg-gray-200 my-4 mx-2"></div>
      <HistorySection />
    </div>
  );
};
