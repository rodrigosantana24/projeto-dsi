import { useEffect, useState } from 'react';
import getFilme from '../services/getMovie';
import getUser from '../services/getUser';


export default function useFriends(uid) {
  const [usuario, setUsuario] = useState(null);
  const [amigos, setAmigos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const userData = await getUser(uid);
      setUsuario(userData);

      const amigoIds = userData?.amigos ? Object.keys(userData.amigos) : [];

      const amigosDetalhados = await Promise.all(
        amigoIds.map(async (amigoId) => {
          const amigoData = await getUser(amigoId);
          if (!amigoData) return null;

          const favIds = Object.values(amigoData.favoritos || {});
          const filmesFavoritos = await Promise.all(
            favIds.map(async (filmeId) => {
                const filme = await getFilme(filmeId);
                return filme ? { id: filmeId, ...filme } : null;
             })
            );

          return {
            uid: amigoId,
            name: amigoData.name,
            email: amigoData.email,
            favoritos: filmesFavoritos.filter(Boolean)
          };
        })
      );

      setAmigos(amigosDetalhados.filter(Boolean));
      setLoading(false);
    }

    fetchData();
  }, [uid]);

  return { usuario, amigos, loading };
}
