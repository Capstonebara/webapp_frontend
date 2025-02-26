import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useFormContext, useWatch } from "react-hook-form";
import { useMediaQuery } from "react-responsive";

import { AuthenticatorSchema } from "./type";
import { authenApi } from "./api";

export function InputValid() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const { control, setValue } = useFormContext<AuthenticatorSchema>();
  const loading = useWatch({ control, name: "loading" });
  const email = useWatch({ control, name: "email" });
  // const index = useWatch({ control, name: "index" });

  const handleClick = async () => {
    setValue("loading", true);

    const email_lower = email.toLowerCase();

    setValue("success", true);

    try {
      // Make the API request using fetch
      const response = await fetch(`${authenApi}${email_lower}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      if (!data) {
        return;
      }

      if (data) {
        setValue("index", data.idx);
      }

      if (data.status === true && data.reg === false) {
        setValue("success", true);
      }

      if (data.status === true && data.reg === true) {
        setValue("alreadyReg", true);
      }

      if (data.status === false) {
        setValue("fail", true);
      }
    } catch (error) {
      console.error("API request failed:", error);
    } finally {
      setValue("loading", false);
    }
  };

  return (
    <>
      {!isMobile ? (
        // Web view
        <>
          <div className="flex w-[600px] gap-x-3 justify-center items-center">
            <Input
              className="w-[500px]"
              label="Email"
              placeholder="E.g: example@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setValue("email", e.target.value)}
            />
            <div>
              <Button
                className="h-[56px]"
                color="primary"
                isLoading={loading}
                onClick={handleClick}
              >
                {loading ? "Loading" : "Confirm"}
              </Button>
            </div>
          </div>
        </>
      ) : (
        // Mobile view
        <>
          <div className="flex flex-col w-[300px] gap-y-3 justify-center items-center">
            <Input
              className="w-[350px]"
              label="Email"
              placeholder="E.g: example@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setValue("email", e.target.value)}
            />
            <div>
              <Button
                className="w-[350px]"
                color="primary"
                isLoading={loading}
                onClick={handleClick}
              >
                {loading ? "Loading" : "Confirm"}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
