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
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { createClient } from "@/lib/supabase/client";
import { Hotel, RestaurantTable } from "@/types";

export default function QRManagementPage() {
  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [tables, setTables] = useState<RestaurantTable[]>([]);

  // Bulk Generator State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkCount, setBulkCount] = useState<number>(10);
  const [generatingBulk, setGeneratingBulk] = useState(false);

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
    downloadLink.download = `${hotel?.slug || "qresto"}-table-${tableNum}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Bulk Tables Generator (1 to N) (Prompt 8.1)
  const handleGenerateBulk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotel || bulkCount <= 0 || bulkCount > 100) return;

    setGeneratingBulk(true);

    try {
      const supabase = createClient();
      const existingNumbers = new Set(tables.map((t) => t.table_number));
      const toInsert: Array<{ hotel_id: string; table_number: number }> = [];

      for (let i = 1; i <= bulkCount; i++) {
        if (!existingNumbers.has(i)) {
          toInsert.push({
            hotel_id: hotel.id,
            table_number: i,
          });
        }
      }

      if (toInsert.length > 0) {
        const { data, error } = await supabase
          .from("tables")
          .insert(toInsert)
          .select();

        if (error) throw error;
        if (data) {
          setTables((prev) =>
            [...prev, ...data].sort((a, b) => a.table_number - b.table_number)
          );
        }
      }

      setIsBulkModalOpen(false);
    } catch (err) {
      console.error("Error bulk generating tables:", err);
    } finally {
      setGeneratingBulk(false);
    }
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
    <div className="space-y-6">
      {/* Top Header - Hidden when printing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
            <QrCode className="w-6 h-6 text-orange-600" /> Table QR Codes
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Apne restaurant ke har table ke liye unique QR code print aur download karein.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={() => setIsBulkModalOpen(true)} className="flex-1 sm:flex-initial">
            <Layers className="w-4 h-4 mr-1.5" /> Bulk Tables (1 to N)
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrintAll} className="flex-1 sm:flex-initial">
            <Printer className="w-4 h-4 mr-1.5" /> Print All QR Cards
          </Button>
        </div>
      </div>

      {/* Manual Add Table Row - Hidden when printing */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Manual Table Jodein</h3>
            <p className="text-xs text-zinc-500">Kisi specific table number ka QR code jodne ke liye</p>
          </div>
        </div>

        <form onSubmit={handleAddManualTable} className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            type="number"
            placeholder="Table No (e.g. 15)"
            value={manualTableNumber}
            onChange={(e) => setManualTableNumber(e.target.value)}
            className="w-full sm:w-36 h-9 text-xs"
            min="1"
            required
          />
          <Button type="submit" variant="primary" size="sm" isLoading={addingTable}>
            Add Table
          </Button>
        </form>
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* GENERAL HOTEL LEVEL QR CODE (Prompt 8.2)                      */}
      {/* ------------------------------------------------------------- */}
      <Card className="p-5 sm:p-6 bg-gradient-to-tr from-orange-50/70 via-white to-amber-50/50 print:hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-orange-200">
            <QRCodeCanvas
              id="qr-code-hotel"
              value={hotelMenuUrl}
              size={120}
              level="H"
              marginSize={2}
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Reception / Counter QR (Bina Table)
            </div>
            <h3 className="text-base font-extrabold text-zinc-900">
              General Hotel Menu QR
            </h3>
            <p className="text-xs text-zinc-600 max-w-md">
              Ise counter, reception ya entry gate par lagayein. Customer ise scan karke checkout par apna table number khud select kar sakte hain.
            </p>
            <div className="pt-1 flex items-center justify-center sm:justify-start gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadQR("hotel")}
              >
                <Download className="w-3.5 h-3.5 mr-1" /> Download PNG
              </Button>
              <Link
                href={hotelMenuUrl}
                target="_blank"
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                Open Menu Link <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* TABLE-WISE QR CODE GRID (Prompt 8.2 & 8.3)                     */}
      {/* ------------------------------------------------------------- */}
      <div ref={printRef} className="space-y-4">
        <h2 className="text-base font-bold text-zinc-900 print:text-center print:text-xl print:mb-6">
          All Table QR Codes ({tables.length} Tables)
        </h2>

        {tables.length === 0 ? (
          <Card className="text-center py-16 px-4">
            <QrCode className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-800">
              Koi table nahi mili
            </h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              &quot;Bulk Tables (1 to N)&quot; button par click karke ek baar me saare tables generate karein.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsBulkModalOpen(true)}
            >
              Generate 10 Tables Now
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 print:grid-cols-2 print:gap-6">
            {tables.map((table) => {
              const tableMenuUrl = `${siteUrl}/menu/${hotel.slug}?table=${table.table_number}`;

              return (
                <div
                  key={table.id}
                  className="bg-white rounded-3xl border border-zinc-200/90 p-5 shadow-xs flex flex-col items-center text-center print:border-2 print:border-black print:rounded-2xl print:p-6 print:break-inside-avoid"
                >
                  {/* Hotel Name & Branding */}
                  <div className="mb-3">
                    <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase">
                      Scan To Order
                    </span>
                    <h3 className="text-base font-black text-zinc-900 truncate max-w-[200px]">
                      {hotel.name}
                    </h3>
                  </div>

                  {/* QR Canvas */}
                  <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 my-1 shadow-inner">
                    <QRCodeCanvas
                      id={`qr-code-${table.table_number}`}
                      value={tableMenuUrl}
                      size={140}
                      level="H"
                      marginSize={2}
                    />
                  </div>

                  {/* Table Badge */}
                  <div className="mt-3 px-4 py-1.5 rounded-full bg-orange-600 text-white font-black text-sm tracking-wide shadow-sm shadow-orange-600/30">
                    TABLE {table.table_number}
                  </div>

                  <p className="text-[11px] text-zinc-400 mt-2 print:text-zinc-600">
                    Camera se scan karein aur direct order karein
                  </p>

                  {/* Action Buttons - Hidden in Print */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 w-full flex items-center justify-between print:hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadQR(table.table_number)}
                      className="text-xs"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" /> PNG
                    </Button>
                    <button
                      onClick={() => handleDeleteTable(table.id)}
                      disabled={deletingId === table.id}
                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Table"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BULK GENERATOR MODAL                                          */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        title="Bulk Tables Generate Karein"
        maxWidth="sm"
      >
        <form onSubmit={handleGenerateBulk} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Kitne Tables Generate Karne Hain? (1 se N)
            </label>
            <Input
              type="number"
              placeholder="e.g. 10 ya 20"
              value={bulkCount}
              onChange={(e) => setBulkCount(parseInt(e.target.value, 10) || 0)}
              min="1"
              max="100"
              required
            />
            <p className="text-[11px] text-zinc-400 mt-1">
              Table 1 se lekar Table {bulkCount || "N"} tak ke sabhi unique QR codes auto generate honge.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsBulkModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={generatingBulk}
            >
              Generate Tables
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
