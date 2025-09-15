const InfoRow = ({
  label,
  value,
  isValueBold,
}: {
  label: string;
  value: React.ReactNode;
  isValueBold?: boolean;
}) => (
  <div className="flex justify-between items-center text-sm">
    <span className="w-28 text-gray-600">{label}</span>
    <span className={`text-gray-800 ${isValueBold ? 'font-bold' : ''}`}>{value}</span>
  </div>
);

export default InfoRow;
