import { Field, FieldDescription } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Badge } from '@/components/ui/badge'
import { Separator } from "@/components/ui/separator"
import { SearchIcon, Hash } from "lucide-react"
import { useRef, useState, useEffect } from "react"

function SearchSection() {
  const PageFindRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    url: string,
    title: string,
    excerpt: string,
    datetime: string,
    readTime: string,
    subResCount: number,
    tags: string[]
  }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // @ts-ignore
    import("/pagefind/pagefind.js").then((module) => {
      module.init();
      PageFindRef.current = module;
    })
    .catch((err) => {
      console.error("PageFind 加载失败:", err);
    })
  }, []);

  let handleInput = async (event: any) => {
    const value = event.target.value.trim();
    setQuery(value);

    if (PageFindRef.current) {
      setLoading(true);
      try {
        // @ts-ignore
        const search = await PageFindRef.current.debouncedSearch(value);
        if (!search || !search.results) {
          setResults([]);
          setLoading(false);
          return;
        }
        let posts = await Promise.all(
          search.results.map((r: any) => r.data())
        );
        posts = posts.map((p: any) => {
          const tags: string[] = [];
          for (const [k, v] of Object.entries(p.meta)) {
            if (k.startsWith("tag")) {
              // @ts-ignore
              tags.push(v);
            }
          }

          return {
            url: p.url,
            title: p.meta.title,
            excerpt: p.excerpt,
            datetime: p.meta.date,
            readTime: p.meta.readtime,
            subResCount: p.sub_results.length,
            tags: tags
          };
        });
        setResults(posts);
      } catch (err) {
        console.error("在搜索时发生错误:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col w-full mx-auto">
      <Field className="max-w-xl w-full mx-auto mb-6">
        <InputGroup>
          <InputGroupInput type="search" placeholder="在此搜索" value={query} onChange={handleInput} />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          {
            query.trim() === '' ? "试试查找文章内容或标签" : loading ? "搜索中..." : `共 ${results.length} 个结果`
          }
        </FieldDescription>
      </Field>

      {
        results.map((data, index) => (
          <div
            key={index.toString()}
            className="max-w-xl w-full mx-auto mb-3 hover:bg-muted/50 rounded-xl border p-4 transition-colors duration-300 ease-in-out"
          >
            <a
              href={data.url}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <div className="grow">
                <h3 className="mb-1 text-lg font-medium">{data.title}</h3>
                <p className="text-muted-foreground mb-2 text-sm">
                  <div dangerouslySetInnerHTML={{__html: data.excerpt}} />
                  <div>{`（等共 ${data.subResCount} 处匹配）`}</div>
                </p>

                <div
                  className="text-muted-foreground mb-2 flex flex-wrap items-center gap-x-2 text-xs"
                >
                  <span>{data.datetime}</span>
                  <Separator orientation="vertical" className="h-4!" />
                  <span>{data.readTime}</span>
                </div>

                  <div className="flex flex-wrap gap-2">
                    {
                      data.tags.map((tag) => (
                        <Badge variant="muted" className="flex items-center gap-x-1">
                          <Hash className="size-3" />
                          {tag}
                        </Badge>
                      ))
                    }
                  </div>
              </div>
            </a>
          </div>
        ))
      }

    </div>
  );
}

export default SearchSection;