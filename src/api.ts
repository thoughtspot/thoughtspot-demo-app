export const getTSObjectList = async (baseUrl: string) => {
    const res = await fetch(`${baseUrl}/api/rest/2.0/metadata/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metadata: [
          {
            type: 'LIVEBOARD',
          },
        ],
        record_size: 10,
      }),
      credentials: 'include',
    });
    const data = await res.json();
    return  data;
};