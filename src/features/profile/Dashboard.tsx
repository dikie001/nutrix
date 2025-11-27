import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StorageStatus() {
  const [exists, setExists] = useState<boolean | null>(null);

  useEffect(() => {
    const keyExists = localStorage.getItem("yourKey") !== null;
    setExists(keyExists);
  }, []);

  return (
    <Card className="w-full max-w-sm mx-auto p-4">
      <CardHeader>
        <CardTitle>Local Storage Status</CardTitle>
      </CardHeader>

      <CardContent>
        {exists === null && <p className="text-sm opacity-60">Checking...</p>}

        {exists === true && (
          <Badge className="bg-green-600 text-white">Key Exists</Badge>
        )}

        {exists === false && (
          <Badge className="bg-red-600 text-white">Key Not Found</Badge>
        )}
      </CardContent>
    </Card>
  );
}
