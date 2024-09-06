// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { db } from "./prisma"
// import GoogleProvider from "next-auth/providers/google"
// import { Adapter } from "next-auth/adapters"
// import { AuthOptions } from "next-auth"

// export const authOptions: AuthOptions = {
//     // Adapter
//     adapter: PrismaAdapter(db) as Adapter,

//     // Configure one or more authentication providers
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID as string,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
//         })
//     ],
//     debug: true,
//     cookies: {
//         sessionToken: {
//             name: `next-auth.session-token`,
//             options: {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === "production", // Habilitar apenas em produção
//                 sameSite: "lax",
//                 path: "/",
//             },
//         },
//         csrfToken: {
//             name: `next-auth.csrf-token`,
//             options: {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === "production", // Habilitar apenas em produção
//                 sameSite: "lax",
//                 path: "/",
//             },
//         },
//     },
//     callbacks: {
//         async session({ session, user }) {
//             console.log({ session, user })
//             session.user = {
//                 ...session.user,
//                 id: user.id,
//             } as any

//             return session
//         },

//         async redirect({ url, baseUrl }) {
//             console.log({ url, baseUrl })

//             return url.startsWith(baseUrl) ? url : baseUrl
//         },
//     }
// }
