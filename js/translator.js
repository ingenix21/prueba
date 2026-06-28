/**
 * translator.js 1.0 2023/05/10
 * by (por): Carlos E. Mendoza S., 10/11/2015
 * Copyright (c) 2015-&up INGENIX Consulting-VE.  All rights reserved.
 *
 * INGENIX 21 grants you a royalty free license to use or modify this
 * software provided that this copyright notice appears on all copies.
 * This software is provided 'AS IS,' without a warranty of any kind.
 *
 * INGENIX 21 le otorga una licencia gratuita para usar y/o modificar
 * este software siempre que mantenga este COPYRIGHT en todas las copias.
 * Este software es entregado 'COMO ESTA', sin ningun tipo de garantia.
 */


FLAG = '../js/flag/1x1';    // sinfonix/js (ISO-8859)
// FLAG = 'images/flag/1x1';   // www/*       (UTF-8)

languages = JSON.parse(unescape(atob( 'JTdCJTIyZW4lMjIlM0ElMjAlNUIlMjJFbmdsaXNoJTIyJTJDJTIydXMlMjIlNUQlMkMlMjJlcyUyMiUzQSUyMCU1QiUyMkVzcGElRjFvbCUyMiUyQyUyMmVzJTIyJTVEJTJDJTIyZnIlMjIlM0ElMjAlNUIlMjJGcmFuJUU3YWlzZSUyMiUyQyUyMmZyJTIyJTVEJTJDJTIycHQlMjIlM0ElMjAlNUIlMjJQb3J0dWd1JUVBcyUyMiUyQyUyMnB0JTIyJTVEJTJDJTIyZGUlMjIlM0ElMjAlNUIlMjJEZXV0c2NoZSUyMiUyQyUyMmRlJTIyJTVEJTJDJTIyaXQlMjIlM0ElMjAlNUIlMjJJdGFsaWFubyUyMiUyQyUyMml0JTIyJTVEJTJDJTIyemglMjIlM0ElMjAlNUIlMjIldTdDMjEldTlBRDQldTRFMkQldTY1ODclMjIlMkMlMjJjbiUyMiU1RCUyQyUyMmhpJTIyJTNBJTIwJTVCJTIyJXUwOTM5JXUwOTNGJXUwOTAyJXUwOTI2JXUwOTQwJTIyJTJDJTIyaW4lMjIlNUQlMkMlMjJhciUyMiUzQSUyMCU1QiUyMiV1MDYzOSV1MDYzMSV1MDYyOCUyMiUyQyUyMmFlJTIyJTVEJTJDJTIycnUlMjIlM0ElMjAlNUIlMjIldTA0MjAldTA0NDMldTA0NDEldTA0NDEldTA0M0EldTA0MzgldTA0MzklMjIlMkMlMjJydSUyMiU1RCUyQyUyMmFmJTIyJTNBJTIwJTVCJTIyQWZyaWslRTFhbnMlMjIlMkMlMjJ6YSUyMiU1RCUyQyUyMnNxJTIyJTNBJTIwJTVCJTIyQWxiYW4lRTlzJTIyJTJDJTIyYWwlMjIlNUQlMkMlMjJhbSUyMiUzQSUyMCU1QiUyMkFtJUUxcmljbyUyMiUyQyUyMmV0JTIyJTVEJTJDJTIyaHklMjIlM0ElMjAlNUIlMjJBcm1lbmlvJTIyJTJDJTIyYW0lMjIlNUQlMkMlMjJhcyUyMiUzQSUyMCU1QiUyMkFzYW0lRTlzJTIyJTJDJTIyaW4lMjIlNUQlMkMlMjJheSUyMiUzQSUyMCU1QiUyMkFpbWFyYSUyMiUyQyUyMnBlJTIyJTVEJTJDJTIyYXolMjIlM0ElMjAlNUIlMjJBemVyYmFpeWFubyUyMiUyQyUyMiUyMiU1RCUyQyUyMmJtJTIyJTNBJTIwJTVCJTIyQmFtYmFyYSUyMiUyQyUyMm1sJTIyJTVEJTJDJTIyZXUlMjIlM0ElMjAlNUIlMjJWYXNjbyUyMiUyQyUyMiUyMiU1RCUyQyUyMmJlJTIyJTNBJTIwJTVCJTIyQmllbG9ycnVzbyUyMiUyQyUyMmJ5JTIyJTVEJTJDJTIyYm4lMjIlM0ElMjAlNUIlMjJCZW5nYWwlRUQlMjIlMkMlMjJiZCUyMiU1RCUyQyUyMmJobyUyMiUzQSUyMCU1QiUyMkJob3NwdXJpJTIyJTJDJTIyJTIyJTVEJTJDJTIyYnMlMjIlM0ElMjAlNUIlMjJCb3NuaW8lMjIlMkMlMjJiYSUyMiU1RCUyQyUyMmJnJTIyJTNBJTIwJTVCJTIyQiVGQWxnYXJvJTIyJTJDJTIyJTIyJTVEJTJDJTIyY2ElMjIlM0ElMjAlNUIlMjJDYXRhbCVFMW4lMjIlMkMlMjIlMjIlNUQlMkMlMjJjZWIlMjIlM0ElMjAlNUIlMjJDZWJ1YW5vJTIyJTJDJTIycGglMjIlNUQlMkMlMjJ6aC1UVyUyMiUzQSUyMCU1QiUyMiV1N0U0MSV1OUFENCV1NEUyRCV1NjU4NyUyMiUyQyUyMmNuJTIyJTVEJTJDJTIyY28lMjIlM0ElMjAlNUIlMjJDb3JzbyUyMiUyQyUyMiUyMiU1RCUyQyUyMmhyJTIyJTNBJTIwJTVCJTIyQ3JvYXRhJTIyJTJDJTIyJTIyJTVEJTJDJTIyY3MlMjIlM0ElMjAlNUIlMjJDaGVjbyUyMiUyQyUyMmN6JTIyJTVEJTJDJTIyZGElMjIlM0ElMjAlNUIlMjJEYW4lRTlzJTIyJTJDJTIyZGslMjIlNUQlMkMlMjJkdiUyMiUzQSUyMCU1QiUyMkRoaXZlaGklMjIlMkMlMjJtdiUyMiU1RCUyQyUyMmRvaSUyMiUzQSUyMCU1QiUyMkRvZ3JpJTIyJTJDJTIyJTIyJTVEJTJDJTIybmwlMjIlM0ElMjAlNUIlMjJIb2xhbmQlRTlzJTIyJTJDJTIyJTIyJTVEJTJDJTIyZW8lMjIlM0ElMjAlNUIlMjJFc3BlcmFudG8lMjIlMkMlMjIlMjIlNUQlMkMlMjJldCUyMiUzQSUyMCU1QiUyMkVzdG9uaW8lMjIlMkMlMjIlMjIlNUQlMkMlMjJlZSUyMiUzQSUyMCU1QiUyMkV3ZSUyMiUyQyUyMiUyMiU1RCUyQyUyMmZpbCUyMiUzQSUyMCU1QiUyMkZpbGlwaW5vJTIwJTI4dGFnYWxvJTI5JTIyJTJDJTIycGglMjIlNUQlMkMlMjJmaSUyMiUzQSUyMCU1QiUyMkZpbiVFOXMlMjIlMkMlMjIlMjIlNUQlMkMlMjJmeSUyMiUzQSUyMCU1QiUyMkZyaXMlRjNuJTIyJTJDJTIyJTIyJTVEJTJDJTIyZ2wlMjIlM0ElMjAlNUIlMjJHYWxsZWdvJTIyJTJDJTIyJTIyJTVEJTJDJTIya2ElMjIlM0ElMjAlNUIlMjJHZW9yZ2lhbm8lMjIlMkMlMjJnZSUyMiU1RCUyQyUyMmVsJTIyJTNBJTIwJTVCJTIyR3JpZWclMjIlMkMlMjJnciUyMiU1RCUyQyUyMmduJTIyJTNBJTIwJTVCJTIyR3VhcmFuJUVEJTIyJTJDJTIyJTIyJTVEJTJDJTIyZ3UlMjIlM0ElMjAlNUIlMjJHdXlhcmF0JUVEJTIyJTJDJTIyJTIyJTVEJTJDJTIyaHQlMjIlM0ElMjAlNUIlMjJDcmlvbGxvJTIwaGFpdGlhbm8lMjIlMkMlMjIlMjIlNUQlMkMlMjJoYSUyMiUzQSUyMCU1QiUyMkhhdXNhJTIyJTJDJTIyJTIyJTVEJTJDJTIyaGF3JTIyJTNBJTIwJTVCJTIySGF3YWlhbm8lMjIlMkMlMjIlMjIlNUQlMkMlMjJoZSUyMiUzQSUyMCU1QiUyMkhlYnJlbyUyMiUyQyUyMmlsJTIyJTVEJTJDJTIyaXclMjIlM0ElMjAlNUIlMjJIZWJyZW8lMjIlMkMlMjJpbCUyMiU1RCUyQyUyMmhtbiUyMiUzQSUyMCU1QiUyMkhtb25nJTIyJTJDJTIyJTIyJTVEJTJDJTIyaHUlMjIlM0ElMjAlNUIlMjJIJUZBbmdhcm8lMjIlMkMlMjIlMjIlNUQlMkMlMjJpcyUyMiUzQSUyMCU1QiUyMklzbGFuZCVFOXMlMjIlMkMlMjIlMjIlNUQlMkMlMjJpZyUyMiUzQSUyMCU1QiUyMklnYm8lMjIlMkMlMjIlMjIlNUQlMkMlMjJpbG8lMjIlM0ElMjAlNUIlMjJJbG9jYW5vJTIyJTJDJTIyJTIyJTVEJTJDJTIyaWQlMjIlM0ElMjAlNUIlMjJJbmRvbmVzaW8lMjIlMkMlMjIlMjIlNUQlMkMlMjJnYSUyMiUzQSUyMCU1QiUyMklybGFuZCVFOXMlMjIlMkMlMjIlMjIlNUQlMkMlMjJqYSUyMiUzQSUyMCU1QiUyMkphcG9uJUU5cyUyMiUyQyUyMmpwJTIyJTVEJTJDJTIyanYlMjIlM0ElMjAlNUIlMjJKYXZhbiVFOXMlMjIlMkMlMjIlMjIlNUQlMkMlMjJqdyUyMiUzQSUyMCU1QiUyMkphdmFuJUU5cyUyMiUyQyUyMiUyMiU1RCUyQyUyMmtuJTIyJTNBJTIwJTVCJTIyQ2FuYXIlRTlzJTIyJTJDJTIyJTIyJTVEJTJDJTIya2slMjIlM0ElMjAlNUIlMjJLYXpham8lMjIlMkMlMjJreiUyMiU1RCUyQyUyMmttJTIyJTNBJTIwJTVCJTIySmVtZXIlMjIlMkMlMjIlMjIlNUQlMkMlMjJydyUyMiUzQSUyMCU1QiUyMktpJUYxYXJ1YW5kYSUyMiUyQyUyMiUyMiU1RCUyQyUyMmdvbSUyMiUzQSUyMCU1QiUyMktvbmthbmklMjIlMkMlMjJpbiUyMiU1RCUyQyUyMmtvJTIyJTNBJTIwJTVCJTIyQ29yZWFuJTIyJTJDJTIya3IlMjIlNUQlMkMlMjJrcmklMjIlM0ElMjAlNUIlMjJLcmlvJTIyJTJDJTIyJTIyJTVEJTJDJTIya3UlMjIlM0ElMjAlNUIlMjJDdXJkbyUyMiUyQyUyMiUyMiU1RCUyQyUyMmNrYiUyMiUzQSUyMCU1QiUyMkt1cmRvJTIwJTI4U29yYW5pJTI5JTIyJTJDJTIyJTIyJTVEJTJDJTIya3klMjIlM0ElMjAlNUIlMjJLaXJnJTIyJTJDJTIyJTIyJTVEJTJDJTIybG8lMjIlM0ElMjAlNUIlMjJMYW9zaWFubyUyMiUyQyUyMmxhJTIyJTVEJTJDJTIybGElMjIlM0ElMjAlNUIlMjJMYXQlRURuJTIyJTJDJTIyJTIyJTVEJTJDJTIybHYlMjIlM0ElMjAlNUIlMjJMZXQlRjNuJTIyJTJDJTIyJTIyJTVEJTJDJTIybG4lMjIlM0ElMjAlNUIlMjJMaW5nYWxhJTIyJTJDJTIyJTIyJTVEJTJDJTIybHQlMjIlM0ElMjAlNUIlMjJMaXR1YW5vJTIyJTJDJTIyJTIyJTVEJTJDJTIybGclMjIlM0ElMjAlNUIlMjJMdWdhbmRhJTIyJTJDJTIyJTIyJTVEJTJDJTIybGIlMjIlM0ElMjAlNUIlMjJMdXhlbWJ1cmd1JUU5cyUyMiUyQyUyMiUyMiU1RCUyQyUyMm1rJTIyJTNBJTIwJTVCJTIyTWFjZWRvbmlvJTIyJTJDJTIyJTIyJTVEJTJDJTIybWFpJTIyJTNBJTIwJTVCJTIyTWFpdGhpbGklMjIlMkMlMjIlMjIlNUQlMkMlMjJtZyUyMiUzQSUyMCU1QiUyMk1hbGdhY2hlJTIyJTJDJTIyJTIyJTVEJTJDJTIybXMlMjIlM0ElMjAlNUIlMjJNYWxheW8lMjIlMkMlMjIlMjIlNUQlMkMlMjJtbCUyMiUzQSUyMCU1QiUyMk1hbGFiYXIlMjIlMkMlMjIlMjIlNUQlMkMlMjJtdCUyMiUzQSUyMCU1QiUyMk1hbHQlRTlzJTIyJTJDJTIyJTIyJTVEJTJDJTIybWklMjIlM0ElMjAlNUIlMjJNYW9yJUVEJTIyJTJDJTIyJTIyJTVEJTJDJTIybXIlMjIlM0ElMjAlNUIlMjJNYXJhdGhpJTIyJTJDJTIyJTIyJTVEJTJDJTIybW5pLU10ZWklMjIlM0ElMjAlNUIlMjJNZWl0ZWlsb24lMjAlMjhtYW5pcHVyaSUyOSUyMiUyQyUyMiUyMiU1RCUyQyUyMmx1cyUyMiUzQSUyMCU1QiUyMk1pem8lMjIlMkMlMjJpcyUyMiU1RCUyQyUyMm1uJTIyJTNBJTIwJTVCJTIyTW9uZ29sJTIyJTJDJTIyJTIyJTVEJTJDJTIybXklMjIlM0ElMjAlNUIlMjJCaXJtYW5vJTIyJTJDJTIyJTIyJTVEJTJDJTIybmUlMjIlM0ElMjAlNUIlMjJOZXBhbCVFRCUyMiUyQyUyMiUyMiU1RCUyQyUyMm5vJTIyJTNBJTIwJTVCJTIyTm9ydWVnbyUyMiUyQyUyMiUyMiU1RCUyQyUyMm55JTIyJTNBJTIwJTVCJTIyTnlhbmphJTIwJTI4Y2hpY2hld2ElMjklMjIlMkMlMjIlMjIlNUQlMkMlMjJvciUyMiUzQSUyMCU1QiUyMk9kaWElMjAlMjhvcml5YSUyOSUyMiUyQyUyMiUyMiU1RCUyQyUyMm9tJTIyJTNBJTIwJTVCJTIyT3JvbW8lMjIlMkMlMjIlMjIlNUQlMkMlMjJwcyUyMiUzQSUyMCU1QiUyMlBhc2h0byUyMiUyQyUyMiUyMiU1RCUyQyUyMmZhJTIyJTNBJTIwJTVCJTIyUGVyc2ElMjIlMkMlMjJpciUyMiU1RCUyQyUyMnBsJTIyJTNBJTIwJTVCJTIyUG9sYWNvJTIyJTJDJTIyJTIyJTVEJTJDJTIycGElMjIlM0ElMjAlNUIlMjJQdW5qYWJpJTIyJTJDJTIyJTIyJTVEJTJDJTIycXUlMjIlM0ElMjAlNUIlMjJRdWVjaHVhJTIyJTJDJTIycGUlMjIlNUQlMkMlMjJybyUyMiUzQSUyMCU1QiUyMlJ1bWFubyUyMiUyQyUyMiUyMiU1RCUyQyUyMnNtJTIyJTNBJTIwJTVCJTIyU2Ftb2FubyUyMiUyQyUyMiUyMiU1RCUyQyUyMnNhJTIyJTNBJTIwJTVCJTIyUyVFMW5zY3IlMjIlMkMlMjIlMjIlNUQlMkMlMjJnZCUyMiUzQSUyMCU1QiUyMkdhJUU5bGljbyUyMGVzYyUyMiUyQyUyMiUyMiU1RCUyQyUyMm5zbyUyMiUzQSUyMCU1QiUyMlNlcGVkaSUyMiUyQyUyMnphJTIyJTVEJTJDJTIyc3IlMjIlM0ElMjAlNUIlMjJTZXJiaW8lMjIlMkMlMjIlMjIlNUQlMkMlMjJzdCUyMiUzQSUyMCU1QiUyMlNlc290byUyMiUyQyUyMiUyMiU1RCUyQyUyMnNuJTIyJTNBJTIwJTVCJTIyU2hvbmElMjIlMkMlMjIlMjIlNUQlMkMlMjJzZCUyMiUzQSUyMCU1QiUyMlNpbmRoaSUyMiUyQyUyMiUyMiU1RCUyQyUyMnNpJTIyJTNBJTIwJTVCJTIyQ2luZ2FsJUU5cyUyMiUyQyUyMiUyMiU1RCUyQyUyMnNrJTIyJTNBJTIwJTVCJTIyRXNsb3ZhY28lMjIlMkMlMjIlMjIlNUQlMkMlMjJzbCUyMiUzQSUyMCU1QiUyMkVzbG92ZW5vJTIyJTJDJTIyJTIyJTVEJTJDJTIyc28lMjIlM0ElMjAlNUIlMjJTb21hbCVFRCUyMiUyQyUyMiUyMiU1RCUyQyUyMnN1JTIyJTNBJTIwJTVCJTIyU3VuZGFuJUU5cyUyMiUyQyUyMnNkJTIyJTVEJTJDJTIyc3clMjIlM0ElMjAlNUIlMjJTdWFqaWxpJTIyJTJDJTIya2UlMjIlNUQlMkMlMjJzdiUyMiUzQSUyMCU1QiUyMlN1ZWNvJTIyJTJDJTIyJTIyJTVEJTJDJTIydGwlMjIlM0ElMjAlNUIlMjJUYWdhbG8lMjAlMjhmaWxpcGlubyUyOSUyMiUyQyUyMiUyMiU1RCUyQyUyMnRnJTIyJTNBJTIwJTVCJTIyVGF5aWtvJTIyJTJDJTIyJTIyJTVEJTJDJTIydGElMjIlM0ElMjAlNUIlMjJUYW1pbCUyMiUyQyUyMmluJTIyJTVEJTJDJTIydHQlMjIlM0ElMjAlNUIlMjJUJUUxcnRhcm8lMjIlMkMlMjIlMjIlNUQlMkMlMjJ0ZSUyMiUzQSUyMCU1QiUyMlRlbHVnJUZBJTIyJTJDJTIyaW4lMjIlNUQlMkMlMjJ0aCUyMiUzQSUyMCU1QiUyMlRhaWxhbmQlRTlzJTIyJTJDJTIyJTIyJTVEJTJDJTIydGklMjIlM0ElMjAlNUIlMjJUaWdyaSVGMWElMjIlMkMlMjJldCUyMiU1RCUyQyUyMnRzJTIyJTNBJTIwJTVCJTIyVHNvbmdhJTIyJTJDJTIyJTIyJTVEJTJDJTIydHIlMjIlM0ElMjAlNUIlMjJUdXJjbyUyMiUyQyUyMiUyMiU1RCUyQyUyMnRrJTIyJTNBJTIwJTVCJTIyVHVyY29tJTIyJTJDJTIyJTIyJTVEJTJDJTIyYWslMjIlM0ElMjAlNUIlMjJUd2klMjAlMjhBa2FuJTI5JTIyJTJDJTIyJTIyJTVEJTJDJTIydWslMjIlM0ElMjAlNUIlMjJVY3Jhbmlhbm8lMjIlMkMlMjJ1YSUyMiU1RCUyQyUyMnVyJTIyJTNBJTIwJTVCJTIyVXJkdSUyMiUyQyUyMnBrJTIyJTVEJTJDJTIydWclMjIlM0ElMjAlNUIlMjJVaWd1ciUyMiUyQyUyMiUyMiU1RCUyQyUyMnV6JTIyJTNBJTIwJTVCJTIyVXpiZWtvJTIyJTJDJTIyJTIyJTVEJTJDJTIydmklMjIlM0ElMjAlNUIlMjJWaWV0bmFtaXRhJTIyJTJDJTIyJTIyJTVEJTJDJTIyY3klMjIlM0ElMjAlNUIlMjJHYWwlRTlzJTIyJTJDJTIyJTIyJTVEJTJDJTIyeGglMjIlM0ElMjAlNUIlMjJYaG9zYSUyMiUyQyUyMnphJTIyJTVEJTJDJTIyeWklMjIlM0ElMjAlNUIlMjJZaWRkaXNoJTIyJTJDJTIyJTIyJTVEJTJDJTIyeW8lMjIlM0ElMjAlNUIlMjJZb3J1YmElMjIlMkMlMjIlMjIlNUQlMkMlMjJ6dSUyMiUzQSUyMCU1QiUyMlp1bCVGQSUyMiUyQyUyMiUyMiU1RCU3RA==')));

LANG  = JSON.parse(localStorage.getItem('LANG'))||{'select':navigator.language,'source':{},'languages':{'es':{}},'error':{}},

UTF8  = ((document.querySelector('meta[charset]')||'').outerHTML||'').toUpperCase().indexOf('UTF-8') +1,
PATH  = location.pathname.split('/'),
APP   = PATH.pop()||'index.html', SUB_APP = '',
PATH  = PATH.join('/')+'/',
SEARCH= location.search.split('?');

if ( APP.indexOf('sinfonix') > -1 && SEARCH.length > 1 ) {
  SEARCH = decodeURI(SEARCH[1].split('#')[0].split('&')[0]).split(' ');
  APP += '?'+ ( ( SEARCH.length > 1) ? SEARCH[1] : SEARCH[0] );
}

if ( !languages[ LANG.select ] ) {
  LANG.select = LANG.select.split('-')[0];
  if ( !languages[ LANG.select ] )
    LANG.select = 'en';
}
if ( !LANG.source[ APP ] )
  LANG.source[ APP ] = {};

label = LANG.languages[LANG.select]||{};

LANG_iface  = document.querySelector('script[data-iface]')||{'dataset':{}};
LANG_iface  = LANG_iface.dataset.iface ||'none';                 // [ jQM | Bootstrap | none ]  Interface
LANG_source = document.querySelectorAll('[data-translate]')||''; // [ <script> | <style> ] To Translator

LANG_translate();

function LANG_translate() {
  // var z = document.body.outerHTML.split('onload=\"')[1].split('\"')[0];
  // if (z)
  //   document.body.dataset.onload = z;

  html = document.body.innerHTML;
  // document.body.onload = void(0);

  if ( LANG.select != 'es' ) {
    if ( ! LANG.source[ APP ][ LANG.select ] ) {
      document.body.onload = void(0);
      return LANG_load(html);
    }
    html = LANG_translate_html(html);
    html = html.split('\"'+ FLAG +'es.svg?xyz\"').join('\"'+ FLAG + (languages[ LANG.select ][1]||'un') +'.svg?xyz\"');
    document.body.innerHTML = html;
  }
  if ( LANG_source.length ) {
    LANG_source_order = [], END = 0;
    LANG_source.forEach(function(data, index) {
      var url = data.dataset.src || data.href || '';
      if ( url.indexOf('.js' )+1 || url.indexOf('.css')+1 ) {
        $.ajax({
          dataType: 'text', url: url, index: index,

        }).always(function( data, textStatus, jqxhr ) {
          if ( textStatus.toUpperCase().indexOf('ERROR') != -1 )
            return LANG_checkInternet(textStatus);

          LANG_translate2(data, this.url, this.index)
        });
      } else {
        LANG_translate2(data.innerHTML, url, index);
      }
    });
  };
}
function LANG_translate2(data, url, index) {
  if ( LANG.select != 'es' )
    data = LANG_translate_script(data);

  LANG_source_order[ index ] = { 'data': data, 'url': url };
  if ( LANG_source.length == ++END ) {
    var z;
    LANG_source_order.forEach(function(e) {
      z = ( e.url.indexOf('.css')+1 ) ? 'style' : 'script';
      $('html').append('<'+ z +' data-src=\"'+ e.url +'\">'+ e.data +'</'+ z +'>');
    });
    LANG_translate_continue();
  }
}
function LANG_translate_html(data) {
  var i, n, END = 0, PRE = 0, NOTR = 0, x, y, z;

  // data  = data.split('<--').join('\x11\x12\x13').split('<');
  data  = data.split('<');
  data.forEach(function(n,i) {
    x = n.split('>');
    y = x[0].toUpperCase().split(' ');
    if ( y[0].search(/[\\!-.+|;]/) == -1 && !['SCRIPT','STYLE'].includes( y[0] ) ) {

      if ( [ 'PRE' ].includes( y[0] ) ) { PRE++ };
      if ( ['/PRE' ].includes( y[0] ) && PRE ) { PRE-- };

      if ( [ 'NOTR', 'xOPTION'].includes( y[0] ) ) { NOTR++ };
      if ( ['/NOTR','x/OPTION'].includes( y[0] ) && NOTR ) { NOTR-- };

      if ( NOTR < 1 ) {
        y = x[ x.length -1 ].split('\n'); if ( !PRE ) { y = [ y.join(' ').replace(/( )\1+/gmi, '$1') ] };
        y.forEach(function(n,i) {
          z = LANG_normalize(n);
          if ( label[z] ) { y[i] = label[z] } else { console.info(z) };
        });
        y = y.join('\n');
        x[ x.length -1 ] = y.split('<').join('&lt;').split('  ').join('&nbsp;&nbsp;');

        x = LANG_putTag(label, x, 'label');
        x = LANG_putTag(label, x, 'value');
        x = LANG_putTag(label, x, 'title');
        x = LANG_putTag(label, x, 'placeholder');
      }
      data[i] = x.join('>');
    }
  })
  return data.join('<');//.split('\x11\x12\x13').join('<--');
}
function LANG_translate_script(data) {
  if ( JSON.stringify(label) != '{}' ) {
    var js = data.split('\x5C\x22').join('\x01\x02\x03').split('\x22'), x, y;
    for( x = 1; x < js.length; x += 2 ) {
      y = label[ js[x].split('\x01\x02\x03').join('\x22') ];
      if ( y )
        js[x] = y.split('\x22').join('\x5C\x22');
    };
    data = js.join('\x22').split('\x01\x02\x03').join('\x5C\x22');
  }
  return data;
}
function LANG_translate_continue() {
  var html, x, y, z;
  if ( document.body.style.visibility != '' )
    document.body.style.visibility = '';

  html = document.createElement('style');
  html.innerHTML = '\
.ui-icon-LANG_flag:after {\
background-image: url(\''+ FLAG + (languages[ LANG.select ][1]||'un') +'.svg\');\
background-position: 3px 6px;\
background-size: 72%;\
}';
  document.body.append(html);
  html = document.querySelector('[name=LANG_Panel_Language]');
  if ( html ) {
    html.title='\
Change language\n\
Cambiar idioma\n\
Changer de langue\n\
Mudar idioma\n\
Sprache ändern\n\
Cambia lingua\n\
';
    if ( UTF8 ) {
      html.title+='\
改变语言\n\
भाषा बदलें\n\
تغيير اللغة\n\
Изменить языкnn\n\
';
    } else {
      Object.keys(languages).forEach(function(select) {
        try { html.title = decodeURIComponent(escape(html.title)) } catch(err){};
      })
    }
  };
  z = document.getElementById('LANG_content')
  if ( ! z || ! z.innerText.trim() ) {

    switch( LANG_iface ) {
      case 'Bootstrap':
        // z = document.getElementById('LANG_content')
        if ( z ) {
          html = '\
<a id=\"LANG\" class=\"nav-link dropdown-toggle\" href=\"#\" data-toggle=\"dropdown\" aria-haspopup=\"true\"\ aria-expanded=\"false\"><img src=\"'+ FLAG + (languages[ LANG.select ][1]||'un') +'.svg\" style=\"width:16px;height:14px\"></a>\
<ul class=\"dropdown-menu dropdown-menu-'+ z.dataset.dropdownMenu +'\" aria-labelledby=\"LANG\" style=\"height:350px;overflow-Y:auto\">';
          Object.keys(languages).forEach(function(select) {
            html +='<li '+ ( ( select == LANG.select ) ? 'style=\"display:none\"' : '' ) +'><a class=\"dropdown-item\" href=\"javascript:LANG_set(\''+ select +'\')\"><img id=\"LANG_flag_'+ select +'\" src=\"'+ FLAG + (languages[ select ][1]||select) +'.svg\" style=\"width:16px;height:14px;\">&nbsp;&nbsp;&nbsp;'+ languages[ select ][0] + ((LANG.languages[ select ]||select=='es') ? ' *': '') +'</a></li>';
          });
          html +='</ul>';

          z.innerHTML = html, x = $('#LANG').find('img'), y = $('#LANG_flag_'+ LANG.select);
          x[0].src    = FLAG +'un.svg';
          x[0].title  = languages[ LANG.select ][0];

          y[0].onload = function(){
            x[0].src = y[0].src;
          }
        }
        break;

      case 'jQM':
        if ( ! document.getElementById('LANG') ) {
          html = '\
  <div data-role=\"header\" data-position=\"fixed\" data-tap-toggle=\"false\" data-theme=\"b\">\
   <a href=\"#\" data-icon=\"fa-arrow-left\" data-iconpos=\"notext\" title=\"Volver Atras\" data-rel=\"back\">back</a>\
   <h1>language ';
          if ( UTF8 ) {
            html+= '\
/ 語言 / भाषा / لغة / язык '
          }
          html+= '\
/ sprache / idioma</h1>\
  </div><!-- /header -->\
  <div data-role=\"main\" class=\"ui-content\">\
   <ul data-role=\"listview\" data-inset=\"true\">'
          Object.keys(languages).forEach(function(select) {
            if ( select != LANG.select )
              html +='\
    <li>\
     <a href=\"javascript:LANG_set(\''+ select +'\')\">\
      <img src=\"'+ FLAG + (languages[ select ][1]||'un') +'.svg\" alt=\"'+ languages[ select ][0] +'\" class=\"ui-li-icon ui-corner-none\">'+ languages[ select ][0] + ((LANG.languages[ select ]||select=='es') ? ' *': '') +'</a></li>';
          });
          html +='\
   </ul>\
  </div>';
          z = document.createElement('div');
          z.id = 'LANG';
          z.dataset.role = 'page';
          z.innerHTML = html;
          document.body.append(z);
          // $('#id').trigger('created');
        }
        break;

      case 'default':
      case 'none':
        if ( z ) {
          html = '';
          Object.keys(languages).forEach(function(select) {
            html +='<li '+ ( ( select == LANG.select ) ? 'style=\"display:none\"' : '' ) +'><a href=\"javascript:LANG_set(\''+ select +'\')\"><img id=\"LANG_flag_'+ select +'\" src=\"'+ FLAG + (languages[ select ][1]||select) +'.svg\" style=\"width:16px;height:14px;\">&nbsp;&nbsp;&nbsp;'+ languages[ select ][0] + ((LANG.languages[ select ]||select=='es') ? ' *': '') +'</a></li>';
          });
          html +='</ul>';

          z.innerHTML = html, x = $('#LANG').find('img'), y = $('#LANG_flag_'+ LANG.select);
          x[0].src    = FLAG +'un.svg';
          x[0].title  = languages[ LANG.select ][0];

          y[0].onload = function(){
            x[0].src = y[0].src;
          }
        }
        break;

      default:
        break;
    }
  };
  // eval(document.body.dataset.onload);
}
function LANG_load(data, f) {
  var text = LANG_load_html(data), END = 0;

  if ( LANG_source ) {
    LANG_source.forEach(function(data) {
      var url = data.dataset.src || data.href || '';
      if ( url.indexOf('.js' )+1 || url.indexOf('.css')+1 ) {
        $.ajax({
          url: url,
          dataType: 'text',

        }).always(function( data, textStatus, jqxhr ) {
          if ( textStatus.toUpperCase().indexOf('ERROR') != -1 )
            return LANG_checkInternet(textStatus);

          text = LANG_load_script(data, text);
          if ( ++END == LANG_source.length )
            LANG_load2(text, f);
        });
      } else {
        text = LANG_load_script(data.innerHTML, text);
        if ( ++END == LANG_source.length )
          LANG_load2(text, f);
      };
    });
  } else {
    LANG_load2(text, f);
  }
}
function LANG_load2(text, f) {
  var END2 = 0, src, x, y, z;
  if ( !LANG.languages[ LANG.select ] )
    LANG.languages[ LANG.select ] = {};

  while ( text ) {
    END2++;
    z = text.substr(4500).indexOf('[\n');
    if ( z != -1 ) { z = z + 4502 } else { z = text.length };
    src = encodeURIComponent( text.substr(0,z) ), text = text.substr(z);
// console.log(src);
    $.ajax({
      // url: 'https://translate.google.com/?sl=es&tl='+ LANG.select +'&text='+ src,
      url: 'https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=es&tl='+ LANG.select +'&q='+ src,
      dataType: 'json',
      mimeType: "*/*; charset=UTF-8",
      xdataSrc: src,

    }).always(function( data, textStatus, jqxhr ) {
      if ( textStatus.toUpperCase().indexOf('ERROR') != -1 ) {
        return LANG_checkInternet(textStatus);
      };
console.log(data);
      if (data[0].length == 1) {
        var x, y, z;
        x = data[0][0][0].split('[\n]').join('[\x00\x01\x02\xff]').split('\x00\x01\x02\xff');
        y = data[0][0][1].split('[\n]').join('[\x00\x01\x02\xff]').split('\x00\x01\x02\xff');
        for (z=0;z<x.length;z++){
          data[0][z] = [ x[z], y[z] ];
        }
      }
      var src = this.xdataSrc, x = '', y = '', z, z0, z1, z2, z3;

      data[0].forEach(function(e) {
console.log(e);
        z  = e[1].split('[\n').join('[');
        y += e[0].split('[\n').join('[');

        if ( z.substr([z.length -1]) == '[' ) {
          if ( x ) {
            z2 = z;
            while( x && ( z0 = src.split(encodeURIComponent( x ) ) ).length < 2 ) { x = x.substr( 0, x.length -1 ) }
              do {
                for (z1 = 1, z3 = encodeURIComponent( z2 ); z1 < z0.length; z1++ ) {
                  if ( z0[ z1 ].indexOf( z3 ) >-1 ) break
                }
              } while( z1 == z0.length && ( z2 = z2.substr( 1 ) ) );
              try {
                x += decodeURIComponent( z0[ z1 ].substr( 0, z0[ z1 ].indexOf( z3 ) + z3.length ) );
              } catch(err){ console.error(err, z0[ z1 ], z3) }
          } else {
            x = z;
          }
console.log(x);
console.log(y);
          x = x.split(' _ ').join('  ').split(' _ ').join('  ').split(' _ ').join('  ').split(': \"').join('\"').split('\n').join('');
          y = y.split(' _ ').join('  ').split(' _ ').join('  ').split(' _ ').join('  ').split(': \"').join('\"').split('\n').join('');

          if (x.split(' \"[').length > 1 && y.split(' \"[').length == 1 )
            y = y.split('\"[').join(' \"[');

          if ( x.substr(0,2)=='] ' ) { x = x.substr(2) } else
          if ( x.substr(0,1)==']'  ) { x = x.substr(1) };

          if ( y.substr(0,2)=='] ' ) { y = y.substr(2) } else
          if ( y.substr(0,1)==']'  ) { y = y.substr(1) };

//           if ( x.substr(x.length-2)==' [' ) { x = x.substr(0,x.length-2) } else
          if ( x.substr(x.length-1)== '[' ) { x = x.substr(0,x.length-1) };

//           if ( y.substr(y.length-2)==' [' ) { y = y.substr(0,y.length-2) } else
          if ( y.substr(y.length-1)== '[' ) { y = y.substr(0,y.length-1) };

          if ( ! UTF8 ) {
            try { y = decodeURIComponent(escape(y)) } catch(err){};
            try { x = decodeURIComponent(escape(x)) } catch(err){};
          }
          if ( x != y )
            LANG.languages[ LANG.select ][ x ] = y;

console.log(x);
console.log(y);
          x = y = '';
        } else {
          if (!x)
            x = z;
        }
      });
      if ( !--END2 && ! text) {
        LANG_load_continue(f);
      }
    });
  };
}
function LANG_load_html(data) {
    var TAG, i, n, text = '', PRE = 0, NOTR = 0, x, y, z;

    TAG = data.split('<script'), z = TAG.shift();
    TAG.forEach(function(n,i) {
      x = n.split('</script>');
      x[0] = x[0].split('>')[0] +'>';
      TAG[i] = x.join('</script>');
    })
    TAG = z + TAG.join('<script');

    TAG = TAG.split('<style'), z = TAG.shift();
    TAG.forEach(function(n,i) {
      x = n.split('</style>');
      x[0] = x[0].split('>')[0] +'>';
      TAG[i] = x.join('</style>');
    })
    TAG = z + TAG.join('<style');

    TAG = TAG.split('<--').join('\x11\x12\x13').split('<');
    TAG.forEach(function(n,i) {
      x = n.split('>');
      y = x[0].toUpperCase().split(' ');
      if ( y[0].search(/[\\!-.+|;]/) == -1 && !['SCRIPT','STYLE'].includes( y[0] ) ) {
        if ( y[0] ==  'PRE' ) { PRE++ };
        if ( y[0] == '/PRE' && PRE ) { PRE-- };

        if ( [ 'NOTR', 'xOPTION'].includes( y[0] ) ) { NOTR++ };
        if ( ['/NOTR','x/OPTION'].includes( y[0] ) && NOTR ) { NOTR-- };

        if ( NOTR < 1 ) {
          y = x[ x.length -1 ].split('\n'); if ( !PRE ) { y = [ y.join(' ').replace(/( )\1+/gmi, '$1') ] };
          y.forEach(function(z) {
            text = LANG_normalize(z, text);
          });
          text = LANG_getTag(text, x, 'value');
          text = LANG_getTag(text, x, 'title');
          text = LANG_getTag(text, x, 'placeholder');
        };
      };
    });
    return text;
}
function LANG_load_script(data, text) {
  var js = data.split('\x5C\x22').join('\x01\x02\x03').split('\x22'), x, y, z;
  for( x=1; x<js.length; x+=2 ) {
    js[x].split('\n').forEach(function(z) {
      text = LANG_normalize(z.split('\x01\x02\x03').join('\x22'), text);
    });
  };
  return text;
}
function LANG_load_continue(f) {
  label = LANG.languages[ LANG.select ];
  if ( ! LANG.source[ APP ][ LANG.select ] )
    LANG.source[ APP ][ LANG.select ] = {};

  if ( SUB_APP ) {
    LANG.source[ APP ][ LANG.select ][ SUB_APP ] = true;
    localStorage.setItem( 'LANG', JSON.stringify( LANG ) );
    if ( f )
      f();

  } else {
    LANG_set(LANG.select)
  }
}
function LANG_set(select) {
  var x, y, z;
  try {
    if ( LANG_iface != 'jQM' ) {
      $('#LANG').find('img')[0].src = FLAG.substr(0,FLAG.length -3) + 'loading21.gif';
    } else {
      $.mobile.loading( 'show' );
    }
  } catch(err) {console.error(err)};

  LANG.select = select.trim();
  localStorage.setItem( 'LANG', JSON.stringify( LANG ) );

  if ( LANG.select != 'es' && ! LANG.languages[ LANG.select ] ) {
    $( '<iframe name=\"LANG_'+ new Date().getTime()+'\" src=\"'+ location.href +'\">' ).css( 'display','none' ).appendTo( 'body' );
    return
  }
  if ( LANG_iface != 'jQM' ) {
    top.parent.location.reload(1);// top.parent.location.href );//.split('#')[0] );
  } else {
    top.parent.location.replace( top.parent.location.href.split('#')[0] );
  }
}
function LANG_normalize(z, text) {
  z = $('<textarea>').html(z).text().split('\xa0').join(' ');
  if ( z.trim() ) {
    z = z.split('¿').join('').split('¡').join('');
    z = LANG_remove(z,'?');
    z = LANG_remove(z,'!');
  } else {
    z = ''
  }
  if ( text != undefined ) {
    if ( z ) {
      z = '] '+ z.split('\"').join(': \"') +'[\n';
      z = z.split('] : \"').join(']\"').split('  ').join(' _ ').split('  ').join(' _ ').split('  ').join(' _ ');
      if ( text.indexOf( z ) == -1 ) {
        text += z;
      }
    }
    return text;
  }
  return z;
}
function LANG_remove(a,b) {
  var z = a.split(b);
  if ( z.length > 2 ) {
    z[ z.length -1 ] = '1234567890abcdef'+ b + z[ z.length -1 ];
//  a = z.join(',').split(',1234567890abcdef'+ b).join(b);
    a = z.join('' ).split( '1234567890abcdef'+ b).join(b);
  };
  return a;
}
function LANG_getTag(text, x, data) {
  var y, z;
  x = x.join('>').split(data +'='), y = x[0].toUpperCase();
  if ( x.length > 1 ) {
    if ( data  == 'title' || data  == 'placeholder' || !y.indexOf('A ') || ( !y.indexOf('INPUT ') && y.split('\'').join('\"').indexOf('TYPE=\"BUTTON\"') +1 ) ) {
      if (x[1][0] == '\"' || x[1][0] == '\'' ) {
        z = x[1].split('\\'+x[1][0]).join('\x01\x02\x03').split( x[1][0] )[1].split('\x01\x02\x03').join('\\'+x[1][0]);
      } else {
        z = x[1].split(' ')[0];
      }
      if ( z.length > 1 ) {
        z.split('&nbsp;').join('_').split('\n').forEach(function(z) {;
          if ( z.trim() && text.indexOf(']'+ z +'[\n') == -1 )
            text +=  ']'+ z +'[\n';
        });
      };
    };
  };
  return text;
}
function LANG_putTag(label, x, data) {
  var y, z, z0, z1;
  x = x.join('>').split(data +'='), y = x[0].toUpperCase();
  if ( x.length > 1 ) {
    if ( data  == 'title' || data  == 'placeholder' || !y.indexOf('A ') || ( !y.indexOf('INPUT ') && y.split('\'').join('\"').indexOf('TYPE=\"BUTTON\"') +1 ) ) {
      if (x[1][0] == '\"' || x[1][0] == '\'' ) {
        z0 = x[1][0], z1=1, x[1] = x[1].split('\\'+ z0).join('\x01\x02\x03');
      } else {
        z0 = ' ', z1=0;
      }
      x[1] = x[1].split(z0);
      y = x[1][z1].split('\x01\x02\x03').join('\\'+ z0).split('\n');
      for ( var n = 0; n < y.length; n++ ) {
        z = label[ y[n] ];
        if ( z )
          y[n] = z;
      };
      x[1][z1] = y.join('\n');
      x[1] = x[1].join(z0).split('\x01\x02\x03').join('\\'+ z0);
    }
  }
  return x.join(data +'=').split('>');
}
function LANG_reset() {
  localStorage.removeItem( 'LANG_'+ APP );
}
function LANG_checkInternet(textStatus) {
  LANG.error[LANG.select] = {};
  LANG.error[LANG.select].PATH = PATH;
  LANG.error[LANG.select].APP  = APP;
  LANG.error[LANG.select].textStatus = textStatus;

  localStorage.setItem( 'LANG', JSON.stringify( LANG ) );

  if ( ! languages[ LANG.select ] )
    LANG.select = 'en';

  try {
    if ( LANG_iface != 'jQM' ) {
      $('#LANG').find('img')[0].src = FLAG + (($('#LANG_flag_')[0].naturalHeight) ? languages[ LANG.select ][1]||LANG.select : 'un') +'.svg';
    } else {
      try { $.mobile.loading( 'hide' ) } catch(err) {console.err(err)};
    }
  } catch(err){};

  alert(languages[ LANG.select ][2]);
  // jQuery_confirm('&nbsp;', languages[ LANG.select ][2]);
}
function Cookies(action, name, value, days, expires) {
 switch (action) {
  case 'Read':
   var myCookies = '; '+document.cookie+'; ',
       myCookie  = '',
       Index     = myCookies.indexOf('; '+name+'=')+name.length+3;

   if (Index >= name.length+3)
    myCookie = myCookies.substring(Index,myCookies.indexOf('; ',Index));

   return decodeURIComponent(myCookie);

  case 'Write':
   var myCookie = name+'='+encodeURIComponent( value );
   if ( days && ! expires ) {
    var expires = new Date();
    expires.setTime( expires.getTime() + ( 1000 * 60 * 60 * 24 * days ) );
   }
   if ( expires )
    myCookie += '; expires=' + expires.toGMTString();

   document.cookie = myCookie + '; SameSite=Lax; path=/;';
   return decodeURIComponent( myCookie );

  case 'Remove':
   var myCookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
   document.cookie = myCookie + '; SameSite=Lax; path=/;';
   return decodeURIComponent( myCookie );

  default:
   var
    massage  ='use: Cookies(action, name[, value[, days[, expires]]])\n';
    massage +='     where: action is \"Read\", \"Write\", \"Remove\"\n';
    massage +='            name is Name of Cookies\n';
    massage +='            value is data to Write\n';
    massage +='            days is number of days to expires a Cookies.\n';
    massage +='          & expires is date to expires a Cookies.\n';
    console.info( massage );
 }
}
