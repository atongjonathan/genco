import { fetchDataFromCollection, savePrices } from '@/data';
import { Button, Card, Header, Input, ProgressBar, Stack } from '@nordhealth/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/app/prices')({
  component: Prices,
});

// Updated type with 10 price fields
export type PricesT = {
  price1?: string;
  price2?: string;
  price3?: string;
  price4?: string;
  price5?: string;
  price6?: string;
  price7?: string;
  price8?: string;
  price9?: string;
  price10?: string;
};

function Prices() {
  const [formData, setFormData] = useState<PricesT>({
    price1: "",
    price2: "",
    price3: "",
    price4: "",
    price5: "",
    price6: "",
    price7: "",
    price8: "",
    price9: "",
    price10: "",
  });

  const mutation = useMutation({
    mutationKey: ["updatePrice"],
    mutationFn: (formData: PricesT) => savePrices(formData),
    onSuccess: () => toast.success("Prices updated successfully!"),
    onError: (error) => toast.error(`Error updating prices: ${error.message}`),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  document.title = "Price Management"

  const pricesQuery = useQuery({
    queryKey: ["pricesQuery"],
    queryFn: () => fetchDataFromCollection("prices"),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (pricesQuery.data) {

      setFormData({
        price1: pricesQuery.data[0]?.price1 ?? "",
        price2: pricesQuery.data[0]?.price2 ?? "",
        price3: pricesQuery.data[0]?.price3 ?? "",
        price4: pricesQuery.data[0]?.price4 ?? "",
        price5: pricesQuery.data[0]?.price5 ?? "",
        price6: pricesQuery.data[0]?.price6 ?? "",
        price7: pricesQuery.data[0]?.price7 ?? "",
        price8: pricesQuery.data[0]?.price8 ?? "",
        price9: pricesQuery.data[0]?.price9 ?? "",
        price10: pricesQuery.data[0]?.price10 ?? "",
      });
    }
  }, [pricesQuery.data]);

  return (
    <>
      <Header slot="header">
        <h1 className="n-typescale-m font-semibold">Price Management</h1>
      </Header>
      {pricesQuery.isFetching && <ProgressBar />}
      <Card>
        <section className="n-grid-2">
          {[...Array(10)].map((_, index) => {
            const priceKey = `price${index + 1}` as keyof PricesT;
            return (
              <Input
                key={priceKey}
                label={`Price ${index + 1}`}
                name={priceKey}
                value={formData[priceKey] || ""}
                onChange={handleChange}
                expand
              />
            );
          })}
        </section>
        <Button
          type="submit"
          variant="primary"
          slot="footer"
          loading={mutation.isPending}
          onClick={() => mutation.mutate(formData)}
        >
          {mutation.isPending ? "Updating Prices..." : "Submit"}
        </Button>
      </Card>
    </>
  );
}
