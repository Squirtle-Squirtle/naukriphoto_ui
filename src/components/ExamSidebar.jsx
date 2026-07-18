import { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import ExamLogo from "./ExamLogo";

function ExamSidebarCard({ exam, active, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
        active
          ? "bg-primary/10 border border-primary/30"
          : "border border-transparent hover:bg-muted"
      }`}
    >
      <ExamLogo src={exam.logoUrl} name={exam.name} color={exam.color} size={32} />
      <div className="flex-1 min-w-0">
        <p
          className="font-semibold text-foreground text-xs truncate"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          {exam.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {exam.fullName || exam.name}
        </p>
      </div>
      {active && (
        <div className="shrink-0">
          <ChevronDown size={14} className="text-primary" />
        </div>
      )}
    </button>
  );
}

/**
 * Right sidebar displaying all exams in a vertical list.
 * Supports search/filter and scrolling.
 */
export default function ExamSidebar({ items, selectedId, onSelect }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.fullName && item.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-72 bg-card border-l border-border flex flex-col h-screen sticky top-14">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border">
        <h3
          className="font-bold text-sm text-foreground mb-3"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          All Exams
        </h3>

        {/* Search box */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded"
            >
              <X size={12} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Exam list */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-3 space-y-1">
          {filteredItems.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              {searchQuery ? "No exams found" : "No exams available"}
            </p>
          ) : (
            filteredItems.map((exam) => (
              <ExamSidebarCard
                key={exam.id}
                exam={exam}
                active={selectedId === exam.id}
                onSelect={() => onSelect(selectedId === exam.id ? null : exam.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer info */}
      <div className="px-4 py-3 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          {filteredItems.length} of {items.length} exam{items.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
