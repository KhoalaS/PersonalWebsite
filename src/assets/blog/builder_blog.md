# Kann dein Builder das auch?

Ich habe letztens etwas mit [ElysiaJS](https://elysiajs.com/) rumgespielt. Ein Framework um End-to-End typsichere HTTP APIs zu schreiben.

Hier ein minimales Beispiel:

```ts
import { Elysia, t } from "elysia"
import { FooService } from "./service"
import { treaty } from "@elysiajs/eden"

// Server
export const app = new Elysia()
  .post(
    "/work",
    async ({ body }) => {
      const response = await FooService.work(body)
      return response
    },
    {
      // Ein Schema für den Typ des Body
      body: t.Object({
        bar: t.String()
      })
    }
  )
  .listen(3000)

export type App = typeof app

// Client
const client = treaty<App>("localhost:3000")
// Alles typisiert, Parameter für post-Funktion und data/error Werte
const { data, error } = await client.work.post({
  bar: "Hello"
})
```

Und das wars schon. Alles schön und gut, aber was unterscheidet ElysiaJS vom Rest? Falls es dir nicht aufgefallen ist, wir benutzen keine einzige Typ Annotation 🤯. Denn Elysia ist darauf ausgerichtet TS zu nutzen, damit man als Entwickler weniger TS schreiben muss.

<br>

Dabei fällt auf, dass die Typ Information aus den Build Schritten des Servers, den Typ der finalen Server Instanz verändert. Deshalb darf man beim Erzeugen des Servers auch die Method-Chain nicht unterbrechen. Am Ende ist es ja immer noch ein Builder.

```ts
const app = new Elysia().get("/hello", "Hello Elysia")

app.get("/user/:id", ({ params: { id } }) => id)
// Der Server kennt nur den `/hello` Endpunkt
```

Aber wie geht das?

Wenn man sich den Quellcode von der `get`-Methode der `Elysia`-Klasse anguckt ist das erstmal gruselig:

```ts
class Elysia<...> {
	get<
		const Path extends string,
		const Input extends Metadata['macro'] &
			InputSchema<keyof Definitions['typebox'] & string>,
		const Schema extends IntersectIfObjectSchema<
			MergeSchema<
				UnwrapRoute<
					Input,
					Definitions['typebox'],
					JoinPath<BasePath, Path>
				>,
				MergeSchema<
					Volatile['schema'],
					MergeSchema<Ephemeral['schema'], Metadata['schema']>
				>
			>,
			Metadata['standaloneSchema'] &
				Ephemeral['standaloneSchema'] &
				Volatile['standaloneSchema']
		>,
		const Decorator extends Singleton & {
			derive: Ephemeral['derive'] & Volatile['derive']
			resolve: Ephemeral['resolve'] & Volatile['resolve']
		},
		const MacroContext extends {} extends Metadata['macroFn']
			? {}
			: MacroToContext<
					Metadata['macroFn'],
					Omit<Input, NonResolvableMacroKey>,
					Definitions['typebox']
				>,
		const Handle extends {} extends MacroContext
			? InlineHandlerNonMacro<NoInfer<Schema>, NoInfer<Decorator>>
			: InlineHandler<
					NoInfer<Schema>,
					NoInfer<Decorator>,
					// @ts-ignore
					MacroContext
				>
	>(
		path: Path,
		// handler: (a: { a: MacroContext }) => any,
		handler: Handle,
		hook?: LocalHook<
			Input,
			// @ts-ignore
			Schema & MacroContext,
			Decorator,
			Definitions['error'],
			keyof Metadata['parser']
		>
	): Elysia<
		BasePath,
		Singleton,
		Definitions,
		Metadata,
		Routes &
			CreateEden<
				JoinPath<BasePath, Path>,
				{
					get: CreateEdenResponse<
						Path,
						Schema,
						MacroContext,
						ComposeElysiaResponse<
							Schema &
								MacroContext &
								Metadata['standaloneSchema'] &
								Ephemeral['standaloneSchema'] &
								Volatile['standaloneSchema'],
							Handle,
							UnionResponseStatus<
								Metadata['response'],
								UnionResponseStatus<
									Ephemeral['response'],
									UnionResponseStatus<
										Volatile['response'],
										// @ts-ignore
										MacroContext['return'] & {}
									>
								>
							>
						>
					>
				}
			>,
		Ephemeral,
		Volatile
	> {
		this.add('GET', path, handler as any, hook)

		return this as any
	}
}
```

Was man nicht alles tut für Type Safety 🚬. Das Konzept lässt sich aber auf folgendes runterbrechen.

```ts
export class Builder<BuildContext = {}> {
  augment<Key extends string, Value>(key: Key, value: Value) {
    // Mach irgendwas mit key und value...
    return this as Builder<
      BuildContext & {
        [K in typeof key]: Value
      }
    >
  }

  access<Key extends keyof BuildContext>(
    key: Key,
    access: (value: BuildContext[Key]) => void
  ) {
    // Typisierter Zugriff auf einen Wert im BuildContext
  }
}
```

Der "Trick" ist am Ende ein Klassen Typ Parameter, welcher bei jedem Build Step angereichert wird mit zusätzlicher Typ Information. Die typische Art TS zu verwenden wird hier in gewisser Weise umgekehrt. Man baut sich seine Kontext Types auf, basierend auf der Semantik eines Build Steps. Die Gültigkeit der Augmentation in `augment` ist abhängig vom Code innerhalb der Funktion und nicht von konkreten Werten die typisiert irgendwo existieren.

