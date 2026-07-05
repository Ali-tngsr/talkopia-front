'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocale, useTranslations } from '@/lib/i18n';
import { courses, type CourseCategory } from '@/lib/mockData';
import { CourseCard } from '@/components/talkotopia/CourseCard';

const CATEGORIES: CourseCategory[] = ['art', 'language', 'math', 'music', 'science', 'coding'];
const AGE_GROUPS = ['3-5', '5-9', '6-10', '7-12', '8-13', '8-12', '7-11'];

export function CoursesPage() {
  const t = useTranslations('CoursesPage');
  const locale = useLocale();
  const isRtl = locale === 'fa';

  const [search, setSearch] = useState('');
  const [selectedCats, setSelectedCats] = useState<CourseCategory[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [sort, setSort] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  const toggleCat = (c: CourseCategory) =>
    setSelectedCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const toggleAge = (a: string) =>
    setSelectedAges((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const reset = () => {
    setSearch('');
    setSelectedCats([]);
    setSelectedAges([]);
    setMinRating(0);
    setMaxPrice(500000);
    setSort('popular');
  };

  const filtered = useMemo(() => {
    let list = courses.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        if (!c.titleEn.toLowerCase().includes(q) && !c.titleFa.includes(search) && !c.subtitleEn.toLowerCase().includes(q) && !c.subtitleFa.includes(search) && !c.instructorEn.toLowerCase().includes(q) && !c.instructorFa.includes(search)) {
          return false;
        }
      }
      if (selectedCats.length && !selectedCats.includes(c.category)) return false;
      if (selectedAges.length && !selectedAges.includes(c.ageGroup)) return false;
      if (c.rating < minRating) return false;
      if (c.price > maxPrice) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'newest':
          return 0;
        case 'priceLow':
          return a.price - b.price;
        case 'priceHigh':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return b.studentsCount - a.studentsCount;
      }
    });
    return list;
  }, [search, selectedCats, selectedAges, minRating, maxPrice, sort]);

  const FilterPanel = (
    <div className="space-y-6 rounded-[2rem] border border-[#5E6646]/10 bg-white/80 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-black text-[#5E6646]">
          <SlidersHorizontal className="h-4 w-4" /> {t('filters.title')}
        </h3>
        <button onClick={reset} className="text-xs font-bold text-[#9EB766] hover:underline">
          {t('reset')}
        </button>
      </div>

      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#5E6646]/60">
          {t('filters.categories')}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#F2EED9]/60 px-3 py-2 text-xs font-bold text-[#5E6646] hover:bg-[#F2EED9]">
              <Checkbox
                checked={selectedCats.includes(c)}
                onCheckedChange={() => toggleCat(c)}
                className="border-[#9EB766] data-[state=checked]:bg-[#9EB766]"
              />
              {t(`categories.${c}`)}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#5E6646]/60">
          {t('filters.ageGroup')}
        </p>
        <div className="flex flex-wrap gap-2">
          {AGE_GROUPS.map((a) => (
            <button
              key={a}
              onClick={() => toggleAge(a)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                selectedAges.includes(a)
                  ? 'bg-[#9EB766] text-white'
                  : 'bg-[#F2EED9]/60 text-[#5E6646] hover:bg-[#F2EED9]'
              }`}
            >
              {isRtl ? a.split('-').map((n) => Number(n).toLocaleString('fa-IR')).join('-') : a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#5E6646]/60">
          {t('filters.priceRange')} (max)
        </p>
        <input
          type="range"
          min={50000}
          max={500000}
          step={10000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#9EB766]"
        />
        <p className="text-xs font-bold text-[#5E6646]/70">
          {isRtl ? maxPrice.toLocaleString('fa-IR') : maxPrice.toLocaleString()} {isRtl ? 'تومان' : 'Toman'}
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#5E6646]/60">
          {t('filters.rating')}
        </p>
        <div className="flex gap-2">
          {[0, 4, 4.5, 4.8].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                minRating === r
                  ? 'bg-[#9EB766] text-white'
                  : 'bg-[#F2EED9]/60 text-[#5E6646] hover:bg-[#F2EED9]'
              }`}
            >
              {r === 0 ? (isRtl ? 'همه' : 'All') : (
                <>
                  <Star className="h-3 w-3 fill-current" />
                  {isRtl ? r.toLocaleString('fa-IR') : r}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className={isRtl ? 'text-right' : 'text-left'}>
        <h1 className="text-3xl font-black text-[#5E6646] sm:text-4xl lg:text-5xl">{t('title')}</h1>
        <p className="mt-1.5 text-base font-medium text-[#5E6646]/70 sm:mt-2 sm:text-lg">{t('subtitle')}</p>
      </header>

      <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#5E6646]/40 start-3.5 h-4 w-4 sm:start-4 sm:h-5 sm:w-5" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="h-11 rounded-2xl border-[#9EB766]/30 bg-white ps-11 text-sm font-medium text-[#5E6646] shadow-sm sm:h-12 sm:ps-12 sm:text-base"
          />
        </div>
        <div className="flex gap-2">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-11 flex-1 rounded-2xl border-[#9EB766]/30 bg-white px-3 text-sm font-bold text-[#5E6646] shadow-sm sm:h-12 sm:flex-none sm:w-56 sm:px-4">
              <SelectValue placeholder={t('filters.sort')} />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="popular">{t('sortOptions.popular')}</SelectItem>
              <SelectItem value="newest">{t('sortOptions.newest')}</SelectItem>
              <SelectItem value="priceLow">{t('sortOptions.priceLow')}</SelectItem>
              <SelectItem value="priceHigh">{t('sortOptions.priceHigh')}</SelectItem>
              <SelectItem value="rating">{t('sortOptions.rating')}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setShowFilters((s) => !s)}
            variant="outline"
            className="h-11 flex-shrink-0 rounded-2xl border-[#9EB766]/40 bg-white px-4 text-sm font-black text-[#5E6646] lg:hidden sm:h-12"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-32">{FilterPanel}</div>
        </aside>

        {showFilters && (
          <div className="lg:hidden">
            {FilterPanel}
          </div>
        )}

        <main>
          <p className="mb-3 text-sm font-bold text-[#5E6646]/70 sm:mb-4">
            <span className="font-black text-[#5E6646]">{isRtl ? filtered.length.toLocaleString('fa-IR') : filtered.length}</span>{' '}
            {t('results')}
          </p>
          {filtered.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-[#5E6646]/20 bg-white/50 p-8 text-center sm:rounded-[2rem] sm:p-12">
              <p className="text-4xl sm:text-5xl">🔍</p>
              <p className="mt-3 font-bold text-[#5E6646]/70 sm:mt-4">{t('empty')}</p>
              <Button onClick={reset} className="mt-4 rounded-full bg-[#9EB766] font-black text-white hover:bg-[#8aa454]">
                {t('reset')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
              {filtered.map((c, i) => (
                <CourseCard key={c.slug} course={c} index={i} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
