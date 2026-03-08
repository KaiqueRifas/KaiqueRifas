const SUPABASE_URL = "https://SEU_PROJETO.supabase.co"
const SUPABASE_KEY = "SUA_PUBLIC_KEY"

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

async function carregarRifa(){

  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .eq("ativa", true)
    .single()

  const card = document.getElementById("card-rifa")

  if(!data){
    card.innerHTML = "<h2>Rifa desligada</h2>"
    return
  }

  card.innerHTML = `
    <h2>${data.nome_rifa}</h2>
    <p>Rifa ligada</p>
    <p>Valor: R$ ${Number(data.valor).toFixed(2)}</p>
    <p>Premiações:</p>
    <p>${data.premiacao}</p>
    <p>Pix: ${data.chave_pix}</p>
  `
}

async function carregarItens(){

  const { data } = await supabase
    .from("items")
    .select("*")
    .order("id")

  const grid = document.getElementById("grid-itens")
  grid.innerHTML = ""

  data.forEach(item => {

    let status = "Livre"
    let cor = "#9be29b"

    if(item.status === "reservado"){
      status = "Reservado"
      cor = "#ffd27a"
    }

    if(item.confirmado){
      status = "Pago"
      cor = "#ff8c8c"
    }

    grid.innerHTML += `
      <div 
        onclick="reservar(${item.id})"
        style="
          background:${cor};
          padding:20px;
          border-radius:10px;
          text-align:center;
          cursor:pointer;
        "
      >
        <h3>${item.nome}</h3>
        <p>${status}</p>
        <p>R$ ${Number(item.valor).toFixed(2)}</p>
      </div>
    `
  })
}

async function reservar(id){

  const nome = prompt("Seu nome")
  if(!nome) return

  const telefone = prompt("Seu telefone")
  if(!telefone) return

  await supabase
    .from("items")
    .update({
      status:"reservado",
      reservado_nome:nome,
      reservado_telefone:telefone
    })
    .eq("id",id)

  carregarItens()
}

carregarRifa()
carregarItens()
