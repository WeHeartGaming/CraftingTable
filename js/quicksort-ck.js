/* Copyright (c) 2013 the authors listed at the following URL, and/or
the authors of referenced articles or incorporated external code:
http://en.literateprograms.org/Quicksort_(JavaScript)?action=history&offset=20070102180347

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Retrieved from: http://en.literateprograms.org/Quicksort_(JavaScript)?oldid=8410
*/function swap(e,t,n){var r=e[t];e[t]=e[n];e[n]=r}function partition(e,t,n,r,i){var s=e[r];swap(e,r,n-1);var o=t,u;for(u=t;u<n-1;++u)if(e[u][i]<=s[i]){swap(e,o,u);++o}swap(e,n-1,o);return o}function qsort(e,t,n,r){if(n-1>t){var i=t+Math.floor(Math.random()*(n-t));i=partition(e,t,n,i,r);qsort(e,t,i,r);qsort(e,i+1,n,r)}}function quick_sort(e,t){qsort(e,0,e.length,t)};