import { supabase } from "@/lib/supabase";

const LATENCY = 200;
const delay = (data, ms = LATENCY) =>
  new Promise((res) => setTimeout(() => res(data), ms));

function paginate(items, q = {}) {
  let out = [...items];
  if (q.search) {
    const s = q.search.toLowerCase();
    out = out.filter((it) =>
      Object.values(it).some((v) => typeof v === "string" && v.toLowerCase().includes(s)),
    );
  }
  if (q.filter) {
    for (const [k, v] of Object.entries(q.filter)) {
      if (v) out = out.filter((it) => String(it[k]) === v);
    }
  }
  if (q.sortBy) {
    out.sort((a, b) => {
      const av = a[q.sortBy],
        bv = b[q.sortBy];
      if (av === bv) return 0;
      return (av > bv ? 1 : -1) * (q.sortDir === "desc" ? -1 : 1);
    });
  }
  const page = q.page ?? 1;
  const pageSize = q.pageSize ?? 12;
  const total = out.length;
  return {
    data: out.slice((page - 1) * pageSize, page * pageSize),
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export const blogsSupabase = {
  list: async (q = {}) => {
    let query = supabase.from("blogs").select("*");

    if (q.search) {
      query = query.or(`title.ilike.%${q.search}%,excerpt.ilike.%${q.search}%,content.ilike.%${q.search}%`);
    }

    if (q.sortBy) {
      const dir = q.sortDir === "desc" ? false : true;
      query = query.order(q.sortBy, { ascending: dir });
    } else {
      query = query.order("date", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching blogs:", error);
      throw error;
    }

    if (q.filter && Object.keys(q.filter).length > 0) {
      let filtered = data;
      for (const [k, v] of Object.entries(q.filter)) {
        if (v) filtered = filtered.filter((it) => String(it[k]) === v);
      }
      return delay(paginate(filtered, q));
    }

    return delay(paginate(data || [], q));
  },

  get: async (id) => {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    if (error) {
      console.error("Error fetching blog:", error);
      throw error;
    }

    return delay(data);
  },

  create: async (payload) => {
    const { data, error } = await supabase
      .from("blogs")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Error creating blog:", error);
      throw error;
    }

    return delay(data);
  },

  update: async (id, payload) => {
    const updatePayload = {
      ...payload,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("blogs")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating blog:", error);
      throw error;
    }

    return delay(data);
  },

  remove: async (id) => {
    const { data, error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error deleting blog:", error);
      throw error;
    }

    return delay(data);
  },
};
