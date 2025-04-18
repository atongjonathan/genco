import { Modal } from '@nordhealth/react';
import { ColumnDef } from "@tanstack/react-table";
import { FarmersTable } from './FarmersTable';

  // Function to get price based on weight
  export const getPriceForWeight = (weight: number, prices: any) => {
    if (!prices) return { price: 0, label: "N/A" };

    if (weight >= 14.0 && weight <= 14.999) return { price: prices.price1, label: "14-14.999" };
    if (weight >= 15.0 && weight <= 15.999) return { price: prices.price2, label: "15-15.999" };
    if (weight >= 16.0 && weight <= 16.999) return { price: prices.price3, label: "16-16.999" };
    if (weight >= 17.0 && weight <= 17.999) return { price: prices.price4, label: "17-17.999" };
    if (weight >= 18.0 && weight <= 18.999) return { price: prices.price5, label: "18-18.999" };
    if (weight >= 19.0 && weight <= 19.999) return { price: prices.price6, label: "19-19.999" };
    if (weight >= 20.0 && weight <= 20.999) return { price: prices.price7, label: "20-20.999" };
    if (weight >= 21.0 && weight <= 21.999) return { price: prices.price8, label: "21-21.999" };
    if (weight >= 22.0 && weight <= 22.999) return { price: prices.price9, label: "22-22.999" };
    if (weight >= 23.0 && weight <= 38.000) return { price: prices.price10, label: "23-38.000" };

    return { price: 0, label: "N/A" }; // Default if no match
};
type Weight = {
  liveWeight: string[];
  carcassWeight: string[];
  pricePerGoatAndSheep:string[];
};

const OfftakeModal = ({ open, setOpen, weight }: { 
  open: boolean; 
  setOpen: (value: boolean) => void; 
  weight: Weight | null; 
}) => {
  // Fetch prices




  // Extract price data (ensure it's available)

  

  // Convert weight into the correct format & compute total amount
  const transformedData = weight
      ? weight.liveWeight.map((live, index) => {
          
          return {
              index: index + 1,  // 1-based index for display
              liveWeight: live,
              carcassWeight: weight.carcassWeight[index], // Safe to access directly
              amount: weight.pricePerGoatAndSheep[index] // Store price value
          };
      })
      : [];



  // Calculate total amount
  const totalAmount = transformedData.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);

  // Define table columns
  const columns: ColumnDef<any>[] = [
      { accessorKey: "index", header: "#", cell: ({ row }) => row.index + 1 },
      { accessorKey: "liveWeight", header: "Live Weight" },
      { accessorKey: "carcassWeight", header: "Carcass Weight" },
      { accessorKey: "amount", header: "Amount" },
  ];

  return weight && (
      <Modal size='m' open={open} onClose={() => setOpen(false)} scrollable>
        <h1>Total Amount: <span className='n-typescale-l'> {totalAmount}</span> </h1>
        <h1>Total Goats: <span className='n-typescale-l'> {transformedData.length}</span> </h1>
             
          <FarmersTable columns={columns} data={transformedData} onTotalChange={() => console.log("Sum")} />
          
          
      </Modal>
  );
};

export default OfftakeModal;
