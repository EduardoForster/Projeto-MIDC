import json
import urllib.request
import urllib.error

url_post = 'http://127.0.0.1:8001/records'
payload = {
    'nome': 'Test User',
    'departamento': 'TI',
    'data_referencia': '2026-09-02',
    'quantidade_entregas': 5,
    'observacao': 'teste'
}
req = urllib.request.Request(url_post, data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as r:
        print('POST RESPONSE:', r.status)
        print(r.read().decode())
except urllib.error.HTTPError as e:
    print('POST ERROR:', e.code)
    print(e.read().decode())

url_get = 'http://127.0.0.1:8001/records'
with urllib.request.urlopen(url_get) as r:
    print('GET RESPONSE:', r.status)
    print(r.read().decode())
