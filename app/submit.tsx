import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useMediaQuery } from "react-responsive";

import { AuthenticatorSchema } from "./type";
import path from "path";

export function Submit() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const { control, setValue } = useFormContext<AuthenticatorSchema>();

  const email = useWatch({ control, name: "email" });
  const name = useWatch({ control, name: "name" });
  const loading = useWatch({ control, name: "loading" });

  const handleSubmit = async () => {
    setValue("loading", true);

    try {
      // Gọi API zip để tạo file ZIP
      const zipResponse = await fetch(`/api/zip`, { method: "POST" });

      if (!zipResponse.ok) {
        console.error(
          "Error creating ZIP:",
          zipResponse.status,
          await zipResponse.text()
        );
        setValue("loading", false);
        return;
      }

      // Lấy danh sách file ZIP từ API
      const { zipFiles } = await zipResponse.json();
      if (!zipFiles || zipFiles.length === 0) {
        console.error("No ZIP files created");
        setValue("loading", false);
        return;
      }

      // Đọc file ZIP từ server
      const zipFilePath = zipFiles[0]; // Lấy file đầu tiên (hoặc lặp qua nếu có nhiều file)
      const zipBlob = await fetch(
        `/api/download?file=${encodeURIComponent(zipFilePath)}`
      ).then((res) => res.blob());
      const zipFile = new File([zipBlob], path.basename(zipFilePath));

      // Chuẩn bị dữ liệu gửi đến API embed
      const formData = new FormData();
      formData.append("file", zipFile);

      // Gửi file ZIP đến API embed
      const embedResponse = await fetch(
        `http://localhost:5500/embed?folder_name=${name}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (embedResponse.ok) {
        setValue("loading", false);
        setValue("isFinish", true);
      } else {
        console.error(
          "Error embedding ZIP:",
          embedResponse.status,
          await embedResponse.text()
        );
      }
    } catch (error) {
      console.error("Error:", error);
      // setValue("loading", false);
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
                <Input disabled label="Email" type="email" value={email} />
                <Input
                  label="Full Name"
                  placeholder="E.g: NGUYEN VAN A"
                  type="name"
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
                <Input disabled label="Email" type="email" value={email} />
                <Input
                  label="Full Name"
                  placeholder="E.g: NGUYEN VAN A"
                  type="name"
                  value={name}
                />
                <Button
                  color="primary"
                  isDisabled={loading}
                  isLoading={loading}
                  onClick={handleSubmit}
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
