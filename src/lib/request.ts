
export function request({
    url,
    data,
    headers
}: {
    url: string
    data?: Record<string, any>,
    headers?: Record<string, string>,
}): Promise<{data: any, code: number, message: string}> {
    return new Promise((resolve, reject) => {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(data || {}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('Authorization') ?? '',
                ...headers
            }
        }).then((res) => res.json())
        .then(res => {
            if (res.code === 0) {
                resolve(res)
            } else if (res.code === 401) {
                localStorage.setItem('Authorization', res.data)
                resolve(request({
                    url,
                    data,
                    headers
                }))
            } else {
                reject(res)
            }
        })
    })
}