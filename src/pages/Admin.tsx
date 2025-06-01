
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import { StockTable } from "@/components/StockTable";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-[#4ADE80]" />
              <h1 className="text-3xl font-bold text-white">Administração</h1>
            </div>
          </div>
        </div>

        {/* Controle de Estoque */}
        <Card className="bg-[#1B1B1B]/90 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <Package className="h-6 w-6 text-[#4ADE80]" />
              Controle de Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StockTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
