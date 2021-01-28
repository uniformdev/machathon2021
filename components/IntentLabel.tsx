export interface IntentLabelProps {
    intentId: string | undefined;
  }
  
  export const IntentLabel: React.FC<IntentLabelProps> = (props) => {
    const { intentId } = props;
  
    if (!intentId) {
      return null;
    }
  
    if (
      intentId == '72ba66d0-0478-4d62-9ef4-5461c89b1ffc' ||
      intentId === 'dev'
    ) {
      return (
        <span className="ml-6 px-6 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Developers
        </span>
      );
    }
  
    if (
      intentId == '0d77df8f-a903-4163-befb-008bd061d454' ||
      intentId === 'marketer'
    ) {
      return (
        <span className="ml-6 px-6 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
          Marketers
        </span>
      );
    }
  
    return (
      <span className="ml-6 px-6 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
        {intentId}
      </span>
    );
  };