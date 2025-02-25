import { useFormContext, useWatch } from "react-hook-form";
import { AuthenticatorSchema } from "./type";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import { useMemo } from "react";
import { useMediaQuery } from "react-responsive";

export function InformationPage() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const { control, setValue } = useFormContext<AuthenticatorSchema>();

  const email = useWatch({ control, name: "email" });
  const loading = useWatch({ control, name: "loading" });
  const name = useWatch({ control, name: "name" });

  const handleSubmit = async () => {
    setValue("loading", true);
    setValue("tempName", name);
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      // Camera access granted
      setValue("faceStep", true);
    } catch (error) {
      // Camera access denied
      alert("Allow to access your camera!");
      setValue("faceStep", false);
    } finally {
      setValue("loading", false);
    }
  };

  const handleDisable = useMemo(() => {
    if (name?.length === 0) {
      return true;
    }

    if (!name) {
      return true;
    }

    return false;
  }, [name]);

  return (
    <>
      {
        // Web view
        !isMobile ? (
          <>
            <div className="flex flex-col gap-y-10">
              <div className="gap-y-2">
                <h1 className="text-2xl">Personal Information</h1>
                <h2 className="text-sm">Please fill out this form!</h2>
              </div>
              <div className="w-[500px] h-[500px] flex flex-col gap-y-3">
                <Input type="email" label="Email" value={email} disabled />
                <Input
                  type="name"
                  label="Full Name"
                  placeholder="E.g: NGUYEN VAN A"
                  value={name}
                  onChange={(e) => setValue("name", e.target.value)}
                />
                <Button
                  color="primary"
                  isLoading={loading}
                  onClick={handleSubmit}
                  isDisabled={handleDisable}
                >
                  {loading ? "Allow access to your camera!" : "Confirm"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Mobile view
          <>
            <div className="flex flex-col gap-y-2">
              <div className="gap-y-2 p-4">
                <h1 className="text-2xl">Personal Information</h1>
                <h2 className="text-sm">Please fill out this form!</h2>
              </div>
              <div className="w-[380px] h-[450px] flex flex-col gap-y-3 p-4">
                <Input type="email" label="Email" value={email} disabled />
                <Input
                  type="name"
                  label="Full Name"
                  placeholder="E.g: NGUYEN VAN A"
                  value={name}
                  onChange={(e) => setValue("name", e.target.value)}
                />

                <Button
                  color="primary"
                  isLoading={loading}
                  onClick={handleSubmit}
                  isDisabled={handleDisable}
                >
                  {loading ? "Allow access to your camera!" : "Confirm"}
                </Button>
              </div>
            </div>
          </>
        )
      }
    </>
  );
}
