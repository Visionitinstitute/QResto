"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import {
  QrCode,
  Download,
  Printer,
  Plus,
  Trash2,
  Store,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase/client";
import { Hotel, RestaurantTable } from "@/types";

export default function QRManagementPage() {
  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [tables, setTables] = useState<RestaurantTable[]>([]);

  // Manual Add Table State
  const [manualTableNumber, setManualTableNumber] = useState<string>("");
  const [addingTable, setAddingTable] = useState(false);

  // Deleting Table State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const printRef = useRef<HTMLDivElement>(null);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

  useEffect(() => {
    async function loadHotelAndTables() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: hotelData } = await supabase
            .from("hotels")
            .select("*")
            .eq("owner_id", user.id)
            .maybeSingle();

          if (hotelData) {
            setHotel(hotelData);

            const { data: tablesData } = await supabase
              .from("tables")
              .select("*")
              .eq("hotel_id", hotelData.id)
              .order("table_number", { ascending: true });

            setTables(tablesData || []);
          }
        }
      } catch (err) {
        console.error("Error loading QR tables:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHotelAndTables();
  }, []);

  // Download Single QR PNG
  const handleDownloadQR = (tableNum: number | "hotel") => {
    const canvas = document.getElementById(
      `qr-code-${tableNum}`
    ) as HTMLCanvasElement;

    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${hotel?.slug || "meraresto"}-table-${tableNum}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Manual Add Table
  const handleAddManualTable = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(manualTableNumber, 10);
    if (!hotel || !num || num <= 0) return;

    setAddingTable(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tables")
        .insert({
          hotel_id: hotel.id,
          table_number: num,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTables((prev) =>
          [...prev, data].sort((a, b) => a.table_number - b.table_number)
        );
        setManualTableNumber("");
      }
    } catch (err) {
      console.error("Error adding table:", err);
    } finally {
      setAddingTable(false);
    }
  };

  // Delete Table
  const handleDeleteTable = async (tableId: string) => {
    setDeletingId(tableId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("tables")
        .delete()
        .eq("id", tableId);

      if (error) throw error;
      setTables((prev) => prev.filter((t) => t.id !== tableId));
    } catch (err) {
      console.error("Error deleting table:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Print All (Prompt 8.3)
  const handlePrintAll = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-zinc-500">QR Codes load ho rahe hain...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200">
        <Store className="w-10 h-10 text-orange-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-zinc-900">Pehle apna hotel set up karein</h2>
        <Link href="/dashboard" className="mt-4 inline-block">
          <Button>Dashboard Overview par jayein</Button>
        </Link>
      </div>
    );
  }

  const hotelMenuUrl = `${siteUrl}/menu/${hotel.slug}`;

  return (
    <div className="space-y-4">
      {/* Top Header - Hidden when printing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <QrCode className="w-4 h-4 text-orange-600" />
            <span>Table QR Codes</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Apne restaurant ke har table ke liye unique QR code print aur download karein.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={handlePrintAll} className="h-8 text-xs">
            <Printer className="w-3.5 h-3.5 mr-1" /> Print QR Cards
          </Button>
        </div>
      </div>

      {/* Manual Add Table Row - Hidden when printing */}
      <Card className="p-3 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-zinc-900">Manual Table Jodein</h3>
            <p className="text-[11px] text-zinc-500">Kisi specific table number ka QR code jodne ke liye</p>
          </div>
        </div>

        <form onSubmit={handleAddManualTable} className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            type="number"
            placeholder="Table No (e.g. 15)"
            value={manualTableNumber}
            onChange={(e) => setManualTableNumber(e.target.value)}
            className="w-full sm:w-32 h-8 text-xs"
            min="1"
            required
          />
          <Button type="submit" variant="primary" size="sm" isLoading={addingTable} className="h-8 text-xs">
            Add
          </Button>
        </form>
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* GENERAL HOTEL LEVEL QR CODE (Prompt 8.2)                      */}
      {/* ------------------------------------------------------------- */}
      <Card className="p-4 sm:p-5 bg-white border border-zinc-200/80 shadow-2xs print:hidden">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200/80 shrink-0">
            <QRCodeCanvas
              id="qr-code-hotel"
              value={hotelMenuUrl}
              size={100}
              level="H"
              marginSize={2}
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Counter QR</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-900">
              General Hotel Menu QR
            </h3>
            <p className="text-xs text-zinc-500 max-w-md">
              Counter, reception ya entry gate par lagayein. Customer checkout par table number select kar sakte hain.
            </p>
            <div className="pt-0.5 flex items-center justify-center sm:justify-start gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadQR("hotel")}
                className="h-7 text-xs px-2.5"
              >
                <Download className="w-3 h-3 mr-1" /> PNG
              </Button>
              <Link
                href={hotelMenuUrl}
                target="_blank"
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                Open Menu <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* TABLE-WISE QR CODE GRID (Prompt 8.2 & 8.3)                     */}
      {/* ------------------------------------------------------------- */}
      <div ref={printRef} className="space-y-3">
        <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider print:text-center print:text-xl print:mb-6">
          All Table QR Codes ({tables.length} Tables)
        </h2>

        {tables.length === 0 ? (
          <Card className="text-center py-12 px-4">
            <QrCode className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-zinc-800">
              Koi table nahi mili
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Upar diye gaye form se table number enter karke add karein.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 print:grid-cols-2 print:gap-6">
            {tables.map((table) => {
              const tableMenuUrl = `${siteUrl}/menu/${hotel.slug}?table=${table.table_number}`;

              return (
                <div
                  key={table.id}
                  className="bg-white rounded-xl border border-zinc-200/80 p-3.5 shadow-2xs hover:shadow-xs transition flex flex-col items-center text-center print:border-2 print:border-black print:rounded-2xl print:p-6 print:break-inside-avoid"
                >
                  {/* Hotel Name & Branding */}
                  <div className="mb-1.5">
                    <span className="text-[10px] font-semibold text-zinc-400 tracking-wider uppercase">
                      Scan To Order
                    </span>
                    <h3 className="text-xs font-bold text-zinc-900 truncate max-w-[140px]">
                      {hotel.name}
                    </h3>
                  </div>

                  {/* QR Canvas */}
                  <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100 my-1">
                    <QRCodeCanvas
                      id={`qr-code-${table.table_number}`}
                      value={tableMenuUrl}
                      size={110}
                      level="H"
                      marginSize={2}
                    />
                  </div>

                  {/* Table Badge */}
                  <div className="mt-2 px-2.5 py-0.5 rounded-md bg-zinc-900 text-white font-bold text-xs tracking-wide">
                    T-{table.table_number}
                  </div>

                  <p className="text-[10px] text-zinc-400 mt-1 print:text-zinc-600">
                    Camera se scan karein
                  </p>

                  {/* Action Buttons - Hidden in Print */}
                  <div className="mt-3 pt-2 border-t border-zinc-100 w-full flex items-center justify-between print:hidden">
                    <button
                      onClick={() => handleDownloadQR(table.table_number)}
                      className="text-[11px] font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> PNG
                    </button>
                    <button
                      onClick={() => handleDeleteTable(table.id)}
                      disabled={deletingId === table.id}
                      className="p-1 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                      title="Delete Table"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
