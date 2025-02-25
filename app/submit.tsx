import { useFormContext, useWatch } from "react-hook-form";
import { AuthenticatorSchema } from "./type";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { convertNameEmail } from "@/config/name";
import { useMediaQuery } from "react-responsive";

export function Submit() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const { control, setValue } = useFormContext<AuthenticatorSchema>();

  const email = useWatch({ control, name: "email" });
  const name = useWatch({ control, name: "name" });
  const loading = useWatch({ control, name: "loading" });

  const handleSubmit = async () => {
    const name = convertNameEmail(email);
    setValue("loading", true);

    try {
      const response = await fetch(`http://localhost:5500/embed`, {
        method: "GET",
      });

      if (response.ok) {
        setValue("loading", false);
        setValue("isFinish", true);
      } else {
        console.error("Error:", response.status, await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {
        // Web view
        !isMobile ? (
          <>
            <div className="flex flex-col gap-y-10">
              <div className="gap-y-2">
                <h1 className="text-2xl">Please check your information!</h1>
              </div>
              <div className="w-[500px] h-[500px] flex flex-col gap-y-3">
                <Input type="email" label="Email" value={email} disabled />
                <Input
                  type="name"
                  label="Full Name"
                  placeholder="E.g: NGUYEN VAN A"
                  value={name}
                />
                <Button
                  color="primary"
                  isLoading={loading}
                  onClick={handleSubmit}
                >
                  {loading ? "Submiting..." : "Submit"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Mobile view
          <>
            <div className="flex flex-col gap-y-2">
              <div className="gap-y-2 p-4">
                <h1 className="text-2xl">Please check your information!</h1>
              </div>
              <div className="w-[380px] h-[380px] flex flex-col gap-y-3 p-4">
                <Input type="email" label="Email" value={email} disabled />
                <Input
                  type="name"
                  label="Full Name"
                  placeholder="E.g: NGUYEN VAN A"
                  value={name}
                />
                <Button
                  color="primary"
                  isLoading={loading}
                  onClick={handleSubmit}
                  isDisabled={loading}
                >
                  {loading ? "Submiting..." : "Submit"}
                </Button>
              </div>
            </div>
          </>
        )
      }
    </>
  );
}
