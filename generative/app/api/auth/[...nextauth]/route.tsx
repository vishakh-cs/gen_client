// @ts-nocheck
import axios from "axios";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL


const authOptions = {
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ||''
          }),
        ],
        callbacks: {
          async signIn({ user, account, profile }) {
           
            if (account?.provider === "google") {
              try {
               
                const response = await axios.post(`${baseUrl}/googlelogin`, {
                  email: user.email,
                  userName: user.name,
                  profileData: profile,
                });
      
                if (response.data.success) {

                  const serverToken = response.data.token; 
                  const hasWorkspace = response.data.user.hasWorkspace;
                  
                  console.log("Successfully sent data to backend:", response.data);
                  const loginResponse = await axios.post("/login", {
                    serverToken: serverToken,
                    hasWorkspace: hasWorkspace,
                    
                  });
                } else {
                  console.error("Failed to send data to backend:", response.data.message);
                }
              } catch (error:any) {
                console.error("Error sending data to backend:", error.message);
              }
            }
      
            return true; 
          },
        },
      };
      
      const handler = NextAuth(authOptions);
      
      export { handler as GET, handler as POST };