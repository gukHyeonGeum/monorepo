const PaymentRow = ({
  label,
  amount,
  isTotal,
}: {
  label: string;
  amount: number;
  isTotal?: boolean;
}) => (
  <div
    className={`flex justify-between items-center py-1.5 ${isTotal ? 'text-base font-bold' : 'text-sm'}`}
  >
    <span className={isTotal ? 'text-orange-400' : 'text-gray-500'}>{label}</span>
    <span className={isTotal ? 'text-orange-400' : 'text-gray-800'}>
      {amount.toLocaleString()}원
    </span>
  </div>
);

export default PaymentRow;
