"use client";

import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  QrCode,
  Plus,
  Printer,
  Download,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, Modal } from "@meraresto/ui";

interface TableItem {
  id: string;
  tableNumber: string;
  capacity: number;
  section: string;
  isOccupied: boolean;
}

const INITIAL_TABLES: TableItem[] = [
  { id: "tbl-1", tableNumber: "1", capacity: 4, section: "Main Hall", isOccupied: true },
  { id: "tbl-2", tableNumber: "2", capacity: 4, section: "Main Hall", isOccupied: true },
  { id: "tbl-3", tableNumber: "3", capacity: 2, section: "Main Hall", isOccupied: false },
  { id: "tbl-4", tableNumber: "4", capacity: 6, section: "Terrace", isOccupied: true },
  { id: "tbl-5", tableNumber: "5", capacity: 4, section: "Terrace", isOccupied: false },
  { id: "tbl-6", tableNumber: "6", capacity: 8, section: "Family Lounge", isOccupied: false },
];

export default function TablesManagementPage() {
  const [tables, setTables] = useState<TableItem[]>(INITIAL_TABLES);
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Single table form
  const [newTableNum, setNewTableNum] = useState("");
  const [newCapacity, setNewCapacity] = useState("4");
  const [newSection, setNewSection] = useState("Main Dining");

  // Bulk tables form
  const [bulkCount, setBulkCount] = useState("10");
  const [bulkSection, setBulkSection] = useState("Main Dining");

  const printAreaRef = useRef<HTMLDivElement>(null);

  const menuBaseUrl =
    process.env.NEXT_PUBLIC_MENU_URL || "https://menu.meraresto.in";
  const restaurantSlug = "balkumari";

  const handleAddSingleTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNum.trim()) return;

    const newTable: TableItem = {
      id: `tbl-${Date.now()}`,
      tableNumber: newTableNum.trim(),
      capacity: parseInt(newCapacity) || 4,
      section: newSection,
      isOccupied: false,
    };

    setTables((prev) => [...prev, newTable]);
    setIsSingleModalOpen(false);
    setNewTableNum("");
  };

  const handleBulkAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(bulkCount) || 10;
    const startIdx = tables.length + 1;

    const newTables: TableItem[] = [];
    for (let i = startIdx; i < startIdx + count; i++) {
      newTables.push({
        id: `tbl-${Date.now()}-${i}`,
        tableNumber: `${i}`,
        capacity: 4,
        section: bulkSection,
        isOccupied: false,
      });
    }

    setTables((prev) => [...prev, ...newTables]);
    setIsBulkModalOpen(false);
  };

  const toggleOccupied = (id: string) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isOccupied: !t.isOccupied } : t))
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div>
          <h2 className="text-xl font-bold text-[#0B192C]">Tables & QR Codes</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure dining tables and print high-resolution customer menu QR codes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            className="border-zinc-300 text-xs"
          >
            <Printer className="h-3.5 w-3.5 mr-1" />
            Print QR Cards
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsBulkModalOpen(true)}
            className="border-zinc-300 text-xs"
          >
            <Layers className="h-3.5 w-3.5 mr-1 text-[#0E8388]" />
            Bulk Tables (1 to N)
          </Button>

          <Button
            size="sm"
            onClick={() => setIsSingleModalOpen(true)}
            className="bg-[#0B192C] hover:bg-zinc-800 text-white text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Table
          </Button>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {tables.map((tbl) => {
          const qrTargetUrl = `${menuBaseUrl}/${restaurantSlug}?table=${tbl.tableNumber}`;
          return (
            <Card key={tbl.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">
                      Table {tbl.tableNumber}
                    </h3>
                    <span className="text-[11px] text-zinc-400 font-medium">
                      {tbl.section} • {tbl.capacity} Seats
                    </span>
                  </div>
                  <button
                    onClick={() => toggleOccupied(tbl.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                      tbl.isOccupied
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {tbl.isOccupied ? "Occupied" : "Available"}
                  </button>
                </div>

                {/* QR Canvas */}
                <div className="py-4 flex flex-col items-center justify-center bg-zinc-50/70 rounded-xl my-3 border border-zinc-100">
                  <div className="p-2 bg-white rounded-lg shadow-2xs">
                    <QRCodeCanvas
                      value={qrTargetUrl}
                      size={120}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-2 font-mono truncate max-w-[180px]">
                    Table #{tbl.tableNumber} QR
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
                <a
                  href={qrTargetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#0E8388] hover:underline inline-flex items-center gap-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Test Menu
                </a>

                <button
                  onClick={() =>
                    setTables((prev) => prev.filter((t) => t.id !== tbl.id))
                  }
                  className="text-zinc-400 hover:text-rose-600 p-1"
                  title="Delete Table"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Single Table Modal */}
      <Modal
        isOpen={isSingleModalOpen}
        onClose={() => setIsSingleModalOpen(false)}
        title="Add Dining Table"
      >
        <form onSubmit={handleAddSingleTable} className="space-y-4">
          <Input
            label="Table Number / Name"
            placeholder="e.g. 7 or Rooftop-1"
            value={newTableNum}
            onChange={(e) => setNewTableNum(e.target.value)}
            required
          />

          <Input
            label="Seating Capacity"
            type="number"
            placeholder="4"
            value={newCapacity}
            onChange={(e) => setNewCapacity(e.target.value)}
            required
          />

          <Input
            label="Section"
            placeholder="e.g. Indoor AC, Balcony"
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
          />

          <Button type="submit" className="w-full bg-[#0B192C] hover:bg-zinc-800 text-white">
            Create Table & Generate QR
          </Button>
        </form>
      </Modal>

      {/* Bulk Add Tables Modal */}
      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        title="Bulk Generate Tables"
      >
        <form onSubmit={handleBulkAdd} className="space-y-4">
          <Input
            label="Number of Tables to Generate"
            type="number"
            placeholder="10"
            value={bulkCount}
            onChange={(e) => setBulkCount(e.target.value)}
            required
          />

          <Input
            label="Section"
            placeholder="e.g. Ground Floor Dining"
            value={bulkSection}
            onChange={(e) => setBulkSection(e.target.value)}
          />

          <p className="text-xs text-zinc-500">
            Will automatically generate table numbers continuing from {tables.length + 1} with individual QR codes.
          </p>

          <Button type="submit" className="w-full bg-[#0B192C] hover:bg-zinc-800 text-white">
            Generate {bulkCount || 0} Tables
          </Button>
        </form>
      </Modal>
    </div>
  );
}

