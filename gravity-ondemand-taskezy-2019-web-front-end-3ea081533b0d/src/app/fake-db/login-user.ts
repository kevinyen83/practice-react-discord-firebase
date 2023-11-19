export class LoginUserFakeDb {
  public static users = [
    {
      id: 11111111,
      loginId: 'darya@gmail.com',
      user: {
        id: 11111111,
        email: 'darya@gmail.com',
        data: {
          mobileVerified: true,
          profileVerified: 2,
          address: 'over here, heeelp, please heeeelp',
          taskezy: {}
        },
        firstname: 'darya',
        lastName: '1111',
        fullName: 'darya 1111',
        timezone: 'Kiev/Europe',
        mobilePhone: '12341234',
        usernameStatus: 'ACTIVE',
        verified: true,
        active: true,
        emailVerified: true
      },
      password: '11111111',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjdkNjNiYTg2MzQifQ.eyJhdWQiOiIyYjQwZWI0Ny1iM2YyLTRhZTUtYjU0ZS0zYjhmZjExNGNmNGEiLCJleHAiOjE2NDY4ODY1OTYsImlhdCI6MTY0Njg4Mjk5NiwiaXNzIjoidGFza2V6eS5jb20iLCJzdWIiOiJjNWJkNTM4Mi0wMmJmLTQ3MjMtOWQxYy01ZGZhMDc0ZmUwMGEiLCJqdGkiOiIzYTEyMTYxYy00OTc2LTRiNTAtOTFlNC1lMGIyMDM0MTdmNzEiLCJhdXRoZW50aWNhdGlvblR5cGUiOiJQQVNTV09SRCIsImVtYWlsIjoiZGFyeWFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImFwcGxpY2F0aW9uSWQiOiIyYjQwZWI0Ny1iM2YyLTRhZTUtYjU0ZS0zYjhmZjExNGNmNGEiLCJyb2xlcyI6W10sInByb2ZpbGVfdmVyaWZpZWQiOjIsIm1vYmlsZSI6Iis2MTQxMjM0MTIzNCIsIm1vYmlsZV92ZXJpZmllZCI6dHJ1ZX0.KKWS-md9xjTJDE_BhSpgN_debzQK6Wl56CenTLikAZU',
      refreshToken: '11111111',
      statusCode: 200
    },
    {
      id: 22222222,
      loginId: 'darya2@gmail.com',
      user: {
        id: 22222222,
        email: 'darya2@gmail.com',
        data: {
          mobileVerified: true,
          profileVerified: 0,
          address: 'over here, heeelp, please heeeelp',
          taskezy: {}
        },
        firstname: 'darya',
        lastName: '1111',
        fullName: 'darya 1111',
        timezone: 'Kiev/Europe',
        mobilePhone: '12341234',
        usernameStatus: 'ACTIVE',
        verified: true,
        active: true,
        emailVerified: true
      },
      password: '22222222',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjdkNjNiYTg2MzQifQ.eyJhdWQiOiIyYjQwZWI0Ny1iM2YyLTRhZTUtYjU0ZS0zYjhmZjExNGNmNGEiLCJleHAiOjE2NDY4ODY1OTYsImlhdCI6MTY0Njg4Mjk5NiwiaXNzIjoidGFza2V6eS5jb20iLCJzdWIiOiJjNWJkNTM4Mi0wMmJmLTQ3MjMtOWQxYy01ZGZhMDc0ZmUwMGEiLCJqdGkiOiIzYTEyMTYxYy00OTc2LTRiNTAtOTFlNC1lMGIyMDM0MTdmNzEiLCJhdXRoZW50aWNhdGlvblR5cGUiOiJQQVNTV09SRCIsImVtYWlsIjoiZGFyeWEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhcHBsaWNhdGlvbklkIjoiMmI0MGViNDctYjNmMi00YWU1LWI1NGUtM2I4ZmYxMTRjZjRhIiwicm9sZXMiOltdLCJwcm9maWxlX3ZlcmlmaWVkIjowLCJtb2JpbGUiOiIrNjE0MTIzNDEyMzQiLCJtb2JpbGVfdmVyaWZpZWQiOnRydWV9.5_fBLSgGfgcACaLIvmsJ44ds-YCJIn9hokeT3p1lhkU',
      refreshToken: '22222222',
      statusCode: 200
    },
    {
      id: 33333333,
      loginId: 'darya3@gmail.com',
      user: {
        id: 33333333,
        email: 'darya3@gmail.com',
        data: {
          mobileVerified: false,
          profileVerified: 0,
          address: 'over here, heeelp, please heeeelp',
          taskezy: {}
        },
        firstname: 'darya',
        lastName: '1111',
        fullName: 'darya 1111',
        timezone: 'Kiev/Europe',
        mobilePhone: '12341234',
        usernameStatus: 'ACTIVE',
        verified: true,
        active: true,
        emailVerified: true
      },
      password: '33333333',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjdkNjNiYTg2MzQifQ.eyJhdWQiOiIyYjQwZWI0Ny1iM2YyLTRhZTUtYjU0ZS0zYjhmZjExNGNmNGEiLCJleHAiOjE2NDY4ODY1OTYsImlhdCI6MTY0Njg4Mjk5NiwiaXNzIjoidGFza2V6eS5jb20iLCJzdWIiOiJjNWJkNTM4Mi0wMmJmLTQ3MjMtOWQxYy01ZGZhMDc0ZmUwMGEiLCJqdGkiOiIzYTEyMTYxYy00OTc2LTRiNTAtOTFlNC1lMGIyMDM0MTdmNzEiLCJhdXRoZW50aWNhdGlvblR5cGUiOiJQQVNTV09SRCIsImVtYWlsIjoiZGFyeWEzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhcHBsaWNhdGlvbklkIjoiMmI0MGViNDctYjNmMi00YWU1LWI1NGUtM2I4ZmYxMTRjZjRhIiwicm9sZXMiOltdLCJwcm9maWxlX3ZlcmlmaWVkIjowLCJtb2JpbGUiOiIrNjE0MTIzNDEyMzQiLCJtb2JpbGVfdmVyaWZpZWQiOmZhbHNlfQ.h96cdG73J1VXPyVTQm5H73lBqDtojNLJFY72JQUKxQY',
      refreshToken: '33333333',
      statusCode: 200
    },
    {
      id: 44444444,
      loginId: 'darya4@gmail.com',
      user: {
        id: 44444444,
        email: 'darya4@gmail.com',
        data: {
          mobileVerified: false,
          profileVerified: 0,
          address: 'over here, heeelp, please heeeelp',
          taskezy: {}
        },
        firstname: 'darya',
        lastName: '1111',
        fullName: 'darya 1111',
        timezone: 'Kiev/Europe',
        mobilePhone: '12341234',
        usernameStatus: 'ACTIVE',
        verified: true,
        active: true,
        emailVerified: false
      },
      password: '44444444',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjdkNjNiYTg2MzQifQ.eyJhdWQiOiIyYjQwZWI0Ny1iM2YyLTRhZTUtYjU0ZS0zYjhmZjExNGNmNGEiLCJleHAiOjE2NDY4ODY1OTYsImlhdCI6MTY0Njg4Mjk5NiwiaXNzIjoidGFza2V6eS5jb20iLCJzdWIiOiJjNWJkNTM4Mi0wMmJmLTQ3MjMtOWQxYy01ZGZhMDc0ZmUwMGEiLCJqdGkiOiIzYTEyMTYxYy00OTc2LTRiNTAtOTFlNC1lMGIyMDM0MTdmNzEiLCJhdXRoZW50aWNhdGlvblR5cGUiOiJQQVNTV09SRCIsImVtYWlsIjoiZGFyeWE0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiYXBwbGljYXRpb25JZCI6IjJiNDBlYjQ3LWIzZjItNGFlNS1iNTRlLTNiOGZmMTE0Y2Y0YSIsInJvbGVzIjpbXSwicHJvZmlsZV92ZXJpZmllZCI6MCwibW9iaWxlIjoiKzYxNDEyMzQxMjM0IiwibW9iaWxlX3ZlcmlmaWVkIjpmYWxzZX0.4typuaed3JEHflPvnwVm37oyAptUnmK9KpdEyxTd2ww',
      refreshToken: '44444444',
      statusCode: 212
    },
    {
      id: 55555555,
      loginId: 'darya5@gmail.com',
      user: {
        id: 55555555,
        email: 'darya5@gmail.com',
        data: {
          mobileVerified: true,
          profileVerified: 2,
          address: 'over here, heeelp, please heeeelp',
          taskezy: {}
        },
        firstname: 'darya',
        lastName: '5555',
        fullName: 'darya 5555',
        timezone: 'Kiev/Europe',
        mobilePhone: '12341234',
        usernameStatus: 'ACTIVE',
        verified: true,
        active: true,
        emailVerified: true
      },
      password: '55555555',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjdkNjNiYTg2MzQifQ.eyJhdWQiOiIyYjQwZWI0Ny1iM2YyLTRhZTUtYjU0ZS0zYjhmZjExNGNmNGEiLCJleHAiOjE2NDY4ODY1OTYsImlhdCI6MTY0Njg4Mjk5NiwiaXNzIjoidGFza2V6eS5jb20iLCJzdWIiOiJjNWJkNTM4Mi0wMmJmLTQ3MjMtOWQxYy01ZGZhMDc0ZmUwMGEiLCJqdGkiOiIzYTEyMTYxYy00OTc2LTRiNTAtOTFlNC1lMGIyMDM0MTdmNzEiLCJhdXRoZW50aWNhdGlvblR5cGUiOiJQQVNTV09SRCIsImVtYWlsIjoiZGFyeWE1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhcHBsaWNhdGlvbklkIjoiMmI0MGViNDctYjNmMi00YWU1LWI1NGUtM2I4ZmYxMTRjZjRhIiwicm9sZXMiOltdLCJwcm9maWxlX3ZlcmlmaWVkIjoyLCJtb2JpbGUiOiIrNjE0MTIzNDEyMzQiLCJtb2JpbGVfdmVyaWZpZWQiOnRydWV9.k_xQfThLZJB_0yq0hxBTzUnp8MFRFN9uT1iEChCLGsg',
      refreshToken: '55555555',
      statusCode: 200
    }
  ];
  public static refresh = [
    {
      id: 11111111,
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjdkNjNiYTg2MzQifQ.eyJhdWQiOiIyYjQwZWI0Ny1iM2YyLTRhZTUtYjU0ZS0zYjhmZjExNGNmNGEiLCJleHAiOjE2NDY4ODY1OTYsImlhdCI6MTY0Njg4Mjk5NiwiaXNzIjoidGFza2V6eS5jb20iLCJzdWIiOiJjNWJkNTM4Mi0wMmJmLTQ3MjMtOWQxYy01ZGZhMDc0ZmUwMGEiLCJqdGkiOiIzYTEyMTYxYy00OTc2LTRiNTAtOTFlNC1lMGIyMDM0MTdmNzEiLCJhdXRoZW50aWNhdGlvblR5cGUiOiJQQVNTV09SRCIsImVtYWlsIjoiZGFyeWFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImFwcGxpY2F0aW9uSWQiOiIyYjQwZWI0Ny1iM2YyLTRhZTUtYjU0ZS0zYjhmZjExNGNmNGEiLCJyb2xlcyI6W10sInByb2ZpbGVfdmVyaWZpZWQiOjIsIm1vYmlsZSI6Iis2MTQxMjM0MTIzNCIsIm1vYmlsZV92ZXJpZmllZCI6dHJ1ZX0.KKWS-md9xjTJDE_BhSpgN_debzQK6Wl56CenTLikAZU'
    },
    {
      id: 22222222,
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjdkNjNiYTg2MzQifQ.eyJhdWQiOiIyYjQwZWI0Ny1iM2YyLTRhZTUtYjU0ZS0zYjhmZjExNGNmNGEiLCJleHAiOjE2NDY4ODY1OTYsImlhdCI6MTY0Njg4Mjk5NiwiaXNzIjoidGFza2V6eS5jb20iLCJzdWIiOiJjNWJkNTM4Mi0wMmJmLTQ3MjMtOWQxYy01ZGZhMDc0ZmUwMGEiLCJqdGkiOiIzYTEyMTYxYy00OTc2LTRiNTAtOTFlNC1lMGIyMDM0MTdmNzEiLCJhdXRoZW50aWNhdGlvblR5cGUiOiJQQVNTV09SRCIsImVtYWlsIjoiZGFyeWEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhcHBsaWNhdGlvbklkIjoiMmI0MGViNDctYjNmMi00YWU1LWI1NGUtM2I4ZmYxMTRjZjRhIiwicm9sZXMiOltdLCJwcm9maWxlX3ZlcmlmaWVkIjowLCJtb2JpbGUiOiIrNjE0MTIzNDEyMzQiLCJtb2JpbGVfdmVyaWZpZWQiOnRydWV9.5_fBLSgGfgcACaLIvmsJ44ds-YCJIn9hokeT3p1lhkU'
    },
    {
      id: 33333333,
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjdkNjNiYTg2MzQifQ.eyJhdWQiOiIyYjQwZWI0Ny1iM2YyLTRhZTUtYjU0ZS0zYjhmZjExNGNmNGEiLCJleHAiOjE2NDY4ODY1OTYsImlhdCI6MTY0Njg4Mjk5NiwiaXNzIjoidGFza2V6eS5jb20iLCJzdWIiOiJjNWJkNTM4Mi0wMmJmLTQ3MjMtOWQxYy01ZGZhMDc0ZmUwMGEiLCJqdGkiOiIzYTEyMTYxYy00OTc2LTRiNTAtOTFlNC1lMGIyMDM0MTdmNzEiLCJhdXRoZW50aWNhdGlvblR5cGUiOiJQQVNTV09SRCIsImVtYWlsIjoiZGFyeWEzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhcHBsaWNhdGlvbklkIjoiMmI0MGViNDctYjNmMi00YWU1LWI1NGUtM2I4ZmYxMTRjZjRhIiwicm9sZXMiOltdLCJwcm9maWxlX3ZlcmlmaWVkIjowLCJtb2JpbGUiOiIrNjE0MTIzNDEyMzQiLCJtb2JpbGVfdmVyaWZpZWQiOmZhbHNlfQ.h96cdG73J1VXPyVTQm5H73lBqDtojNLJFY72JQUKxQY'
    },
    {
      id: 44444444,
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjdkNjNiYTg2MzQifQ.eyJhdWQiOiIyYjQwZWI0Ny1iM2YyLTRhZTUtYjU0ZS0zYjhmZjExNGNmNGEiLCJleHAiOjE2NDY4ODY1OTYsImlhdCI6MTY0Njg4Mjk5NiwiaXNzIjoidGFza2V6eS5jb20iLCJzdWIiOiJjNWJkNTM4Mi0wMmJmLTQ3MjMtOWQxYy01ZGZhMDc0ZmUwMGEiLCJqdGkiOiIzYTEyMTYxYy00OTc2LTRiNTAtOTFlNC1lMGIyMDM0MTdmNzEiLCJhdXRoZW50aWNhdGlvblR5cGUiOiJQQVNTV09SRCIsImVtYWlsIjoiZGFyeWE0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiYXBwbGljYXRpb25JZCI6IjJiNDBlYjQ3LWIzZjItNGFlNS1iNTRlLTNiOGZmMTE0Y2Y0YSIsInJvbGVzIjpbXSwicHJvZmlsZV92ZXJpZmllZCI6MCwibW9iaWxlIjoiKzYxNDEyMzQxMjM0IiwibW9iaWxlX3ZlcmlmaWVkIjpmYWxzZX0.4typuaed3JEHflPvnwVm37oyAptUnmK9KpdEyxTd2ww'
    },
    {
      id: 55555555,
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjdkNjNiYTg2MzQifQ.eyJhdWQiOiIyYjQwZWI0Ny1iM2YyLTRhZTUtYjU0ZS0zYjhmZjExNGNmNGEiLCJleHAiOjE2NDY4ODY1OTYsImlhdCI6MTY0Njg4Mjk5NiwiaXNzIjoidGFza2V6eS5jb20iLCJzdWIiOiJjNWJkNTM4Mi0wMmJmLTQ3MjMtOWQxYy01ZGZhMDc0ZmUwMGEiLCJqdGkiOiIzYTEyMTYxYy00OTc2LTRiNTAtOTFlNC1lMGIyMDM0MTdmNzEiLCJhdXRoZW50aWNhdGlvblR5cGUiOiJQQVNTV09SRCIsImVtYWlsIjoiZGFyeWE1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhcHBsaWNhdGlvbklkIjoiMmI0MGViNDctYjNmMi00YWU1LWI1NGUtM2I4ZmYxMTRjZjRhIiwicm9sZXMiOltdLCJwcm9maWxlX3ZlcmlmaWVkIjoyLCJtb2JpbGUiOiIrNjE0MTIzNDEyMzQiLCJtb2JpbGVfdmVyaWZpZWQiOnRydWV9.k_xQfThLZJB_0yq0hxBTzUnp8MFRFN9uT1iEChCLGsg'
    }
  ];
}
