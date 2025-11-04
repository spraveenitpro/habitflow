"use client";

type CategoryFilterProps = {
  categories: string[];
  active: string | null;
  onChange: (value: string | null) => void;
};

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <button
        type="button"
        className={!active ? "active" : ""}
        onClick={() => onChange(null)}
      >
        All habits
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={active === category ? "active" : ""}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
