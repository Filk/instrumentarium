var totalPistas =4; 
var volumes = [];
var minhaPistaPlayer = [];
var slidersValor= [];
var mudarImagem=true;
var valorInicialSliders=90;
var ganhoSlidersInicial=valorInicialSliders/100;
var wavesurfer = [];

// data do ficheiro JSON
var dataJSON = [];

$.getJSON("assets/temas.json", function(data) 
{
  var items = [];
  $.each(data, function(key, val) 
  {
    items.push(val);

    for (var i=0; i<val.length; i++)
	{
		var x = document.getElementById("inputGroupSelect01");
		var option = document.createElement("option");
		option.text = val[i];
		x.add(option);
		dataJSON.push(val[i]);
	}

	//coloca o nome da primeira música
	document.getElementById("inputGroupSelect01").selectedIndex = 0;
	document.getElementById("nomePresenteCantiga").innerHTML = val[0];
  }); 
});


//função que corre quando página é carregada pela primeira vez
window.onload = function() 
{
	StartAudioContext(Tone.context, '#playImagem').then( function()
	{
		//started
	});

	for (var i=1; i<=totalPistas; i++)
	{
		//volume inicial quando faz load do áudio
		 volumes[i-1] = new Tone.Volume(Tone.gainToDb(ganhoSlidersInicial)).toMaster();
		 //atualização o slider na página
		 document.getElementById("myRange" + (i-1)).value = valorInicialSliders;

		 //load do áudio
		 minhaPistaPlayer[i-1] = new Tone.Player(
		 {
		 	//path para as pistas
		  url: "assets/Cantigas/"+dataJSON[0]+"/"+i+".mp3",

		  //função para avisar do load
		  onload: fizLoad(i-1)
		 }).sync().start(0).connect(volumes[i-1]);


		wavesurfer[i-1] = new WaveSurfer.create(
		{
	 	container: '#waveform'+i,
	    waveColor: 'green',
	    progressColor: 'green',
	    responsive: 'true',
	    barHeight: '1',
	    height: '70',
	    cursorColor: "#d3d3d3",
	    interact: false,
	    normalize: true,
	    scrollParent: false,
	    backend: 'MediaElement'
	    });

	    //load waveform
		wavesurfer[i-1].drawBuffer();
		wavesurfer[i-1].load("assets/Cantigas/"+dataJSON[i-1]+"/"+i+".mp3");
	}

	document.getElementById("loading").style.display = "none";

	//double click valor normal
	$("#myRange0").dblclick(function()
	{
		$(this).val(valorInicialSliders);
		slidersValor[0]=ganhoSlidersInicial;
		volumes[0].volume.value = Tone.gainToDb((slidersValor[0])*(slidersValor[0]));
	});
	$("#myRange1").dblclick(function()
	{
		$(this).val(valorInicialSliders);
		slidersValor[1]=ganhoSlidersInicial;
		volumes[1].volume.value = Tone.gainToDb((slidersValor[1])*(slidersValor[1]));
	});
	$("#myRange2").dblclick(function()
	{
		$(this).val(valorInicialSliders);
		slidersValor[2]=ganhoSlidersInicial;
		volumes[2].volume.value = Tone.gainToDb((slidersValor[2])*(slidersValor[2]));
	});
	$("#myRange3").dblclick(function()
	{
		$(this).val(valorInicialSliders);
		slidersValor[3]=ganhoSlidersInicial;
		volumes[3].volume.value = Tone.gainToDb((slidersValor[3])*(slidersValor[3]));
	});
};	

//função para atualizar página e temas
function loadTemas(meuIndex)
{
	for (var i=1; i<=totalPistas; i++)
	{
	 //atualização o slider na página
	 document.getElementById("myRange" + (i-1)).value = valorInicialSliders;

	 //load do áudio
	 minhaPistaPlayer[i-1].load("assets/Cantigas/"+dataJSON[meuIndex]+"/"+i+".mp3", fizLoad(i-1));
	 //load waveform
	 wavesurfer[i-1].load("assets/Cantigas/"+dataJSON[meuIndex]+"/"+i+".mp3");
	}
}

//escolha de nova canção do dropmenu
function atualizaEscolhaCancoes()
{	
	//para o áudio, se o áudio estiver a tocar
	Tone.Transport.stop();

	//saca as imagens do play e stop enquanto se faz load
	document.getElementById("playImagem").style.display = "none";
	document.getElementById("stopImagem").style.display = "none";
	document.getElementById("loading").style.display = "block";

	//apaga os temas antigos
	for (var i=0; i<totalPistas; i++)
	{
		wavesurfer[i].stop();
		wavesurfer[i].empty();
	}

	//sabe o index do tema que foi escolhido
	var indexTema = document.getElementById("inputGroupSelect01").selectedIndex;
	//faz load das pistas
	loadTemas(indexTema);

	//atualiza o nome do tema na parte superior central
	var elm = document.getElementById("nomePresenteCantiga");
	var newone = elm.cloneNode(true);
	elm.parentNode.replaceChild(newone, elm);
	document.getElementById("nomePresenteCantiga").innerHTML = dataJSON[indexTema];
}

//play and stop buttons
function mudaImagem()
{
	//se em pausa
	if (mudarImagem)
	{
		document.getElementById("loading").style.display = "none";
		document.getElementById("playImagem").style.display = "none";
		document.getElementById("stopImagem").style.display = "block";
		for (var i=0; i<totalPistas; i++)
		{
			wavesurfer[i].play();
			wavesurfer[i].setMute(true);
		}
		Tone.Transport.start();
	}
	//se play
	if (!mudarImagem)
	{
		document.getElementById("loading").style.display = "none";
		document.getElementById("playImagem").style.display = "block";
		document.getElementById("stopImagem").style.display = "none";
		for (var i=0; i<totalPistas; i++)
		{
			wavesurfer[i].stop();
		}
		Tone.Transport.stop();
	}
	//atualizar o boolean
	mudarImagem=!mudarImagem;
}

//função para sacar o valor do slider na página e controlar o volume de cada pista áudio
function valorSliders()
{
	for (var j=0; j<totalPistas; j++)
	{
	  slidersValor[j] = document.getElementById("myRange" + j).value;
	  volumes[j].volume.value = Tone.gainToDb((slidersValor[j]/100)*(slidersValor[j]/100));
	}
}

function fizLoad(indexLoadCadaPista)
{
	//displays o controle de play e stop quando sons estão loaded
	Tone.Buffer.on('load', function()
	{
		mudarImagem=true;
		document.getElementById("loading").style.display = "none";
		document.getElementById("playImagem").style.display = "block";
		document.getElementById("stopImagem").style.display = "none";
	})
}
