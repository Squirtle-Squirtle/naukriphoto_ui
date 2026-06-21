import { useEffect, useState } from "react";
import { loadCatalog } from "../services/catalogService";

/**
 * Loads the XML-driven catalog (public/exams.xml) once and splits it into
 * exams vs. general services based on each entry's `type` attribute.
 *
 * Returns: { exams, services, loading, error }
 *
 * Every catalog-driven component should go through this hook rather than
 * importing static data, so the whole UI stays in sync with the XML file.
 */
export function useCatalog() {
  const [exams, setExams] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    loadCatalog()
      .then((entries) => {
        if (cancelled) return;
        setExams(entries.filter((e) => e.type === "exam"));
        setServices(entries.filter((e) => e.type === "service"));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load catalog");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { exams, services, loading, error };
}
