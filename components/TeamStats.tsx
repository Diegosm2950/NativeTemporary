import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';
import { Cedula } from '@/types/cedulas';
import { Ionicons } from '@expo/vector-icons';

interface SubItem {
  label: string;
  value: string;
}

interface MatchStatsProps {
  matchData: Cedula;
}

const MatchStatsCard = ({ matchData }: MatchStatsProps) => {
  const colorScheme = useColorScheme();
  const [expandedStats, setExpandedStats] = useState<Record<string, boolean>>({});

  // Toggle expanded state for a stat
  const toggleExpand = (statKey: string) => {
    setExpandedStats(prev => ({
      ...prev,
      [statKey]: !prev[statKey]
    }));
  };

  // Existing stats
  const tarjetasAmarillas = matchData.tarjetas.filter(card => card.tipo === 'T-A').length;
  const tarjetasRojas = matchData.tarjetas.filter(card => card.tipo === 'T-R').length;
  const lesiones = matchData.lesiones.length;
  const cambios = matchData.cambios.length;

  // New match action stats
  const acciones = matchData.marcador || [];
  const tries = acciones.filter(accion => accion.accion === 'T').length;
  const conversiones = acciones.filter(accion => accion.accion === 'C').length;
  const drops = acciones.filter(accion => accion.accion === 'D').length;

  const equipoLocal = matchData.datosPartido.equipoLocal.nombre;
  const equipoVisitante = matchData.datosPartido.equipoVisitante.nombre;

  // Existing team stats
  const estadisticasLocal = {
    tarjetasAmarillas: matchData.tarjetas.filter(card => card.equipo === equipoLocal && card.tipo === 'T-A').length,
    tarjetasRojas: matchData.tarjetas.filter(card => card.equipo === equipoLocal && card.tipo === 'T-R').length,
    lesiones: matchData.lesiones.filter(lesion => lesion.equipo === equipoLocal).length,
    cambios: matchData.cambios.filter(cambio => cambio.equipo === equipoLocal).length,
    tries: acciones.filter(accion => accion.equipo === equipoLocal && accion.accion === 'T').length,
    conversiones: acciones.filter(accion => accion.equipo === equipoLocal && accion.accion === 'C').length,
    drops: acciones.filter(accion => accion.equipo === equipoLocal && accion.accion === 'D').length,
  };

  const estadisticasVisitante = {
    tarjetasAmarillas: matchData.tarjetas.filter(card => card.equipo === equipoVisitante && card.tipo === 'T-A').length,
    tarjetasRojas: matchData.tarjetas.filter(card => card.equipo === equipoVisitante && card.tipo === 'T-R').length,
    lesiones: matchData.lesiones.filter(lesion => lesion.equipo === equipoVisitante).length,
    cambios: matchData.cambios.filter(cambio => cambio.equipo === equipoVisitante).length,
    tries: acciones.filter(accion => accion.equipo === equipoVisitante && accion.accion === 'T').length,
    conversiones: acciones.filter(accion => accion.equipo === equipoVisitante && accion.accion === 'C').length,
    drops: acciones.filter(accion => accion.equipo === equipoVisitante && accion.accion === 'D').length,
  };

  const renderStat = (label: string, value: string | number | boolean, subItems: SubItem[] = [], statKey: string) => {
    const displayValue = typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value;
    const isExpanded = expandedStats[statKey] || false;
    
    return (
      <View>
        <TouchableOpacity 
          style={styles.statRow} 
          onPress={() => subItems.length > 0 && toggleExpand(statKey)}
          activeOpacity={subItems.length > 0 ? 0.6 : 1}
        >
          <Text style={[styles.label, { color: Colors[colorScheme].text }]}>{label}</Text>
          <View style={styles.valueContainer}>
            <Text style={[styles.value, { color: Colors[colorScheme].text }]}>{displayValue}</Text>
            {subItems.length > 0 && (
              <Ionicons 
                name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                size={16} 
                color={Colors[colorScheme].textSecondary}
                style={styles.chevron}
              />
            )}
          </View>
        </TouchableOpacity>
        
        {isExpanded && subItems.map((subItem, index) => (
          <View key={index} style={styles.subItemRow}>
            <Text style={[styles.subLabel, { color: Colors[colorScheme].textSecondary }]}>{subItem.label}</Text>
            <Text style={[styles.subValue, { color: Colors[colorScheme].textSecondary }]}>{subItem.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: "#257E4217" }
    ]}>
      <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Estadísticas del Partido</Text>
                  
      {/* Existing stats */}
      {renderStat('Tarjetas Amarillas', tarjetasAmarillas, 
        matchData.tarjetas.filter(card => card.tipo === 'T-A').map((card, index) => ({
          label: `Jugador (min ${card.minuto})`,
          value: card.jugador
        })), 'tarjetasAmarillas'
      )}
      
      {renderStat('Tarjetas Rojas', tarjetasRojas, 
        matchData.tarjetas.filter(card => card.tipo === 'T-R').map((card, index) => ({
          label: `Jugador (min ${card.minuto})`,
          value: card.jugador
        })), 'tarjetasRojas'
      )}
      
      {renderStat('Lesiones', lesiones, 
        matchData.lesiones.map((lesion, index) => ({
          label: `Jugador (${lesion.gravedad})`,
          value: `${lesion.jugador} - ${lesion.area}`
        })), 'lesiones'
      )}
      
      {renderStat('Cambios', cambios, 
        matchData.cambios.map((cambio, index) => ({
          label: `Cambio ${index + 1}`,
          value: `${cambio.sale} → ${cambio.entra}`
        })), 'cambios'
      )}
      
      {/* New match action stats */}
      {renderStat('Tries', tries, 
        acciones.filter(accion => accion.accion === 'T').map((accion, index) => ({
          label: `Jugador (min ${accion.tiempo})`,
          value: accion.jugador
        })), 'tries'
      )}
      
      {renderStat('Conversiones', conversiones, 
        acciones.filter(accion => accion.accion === 'C').map((accion, index) => ({
          label: `Jugador (min ${accion.tiempo})`,
          value: accion.jugador
        })), 'conversiones'
      )}
      
      {renderStat('Drops', drops, 
        acciones.filter(accion => accion.accion === 'D').map((accion, index) => ({
          label: `Jugador (min ${accion.tiempo})`,
          value: accion.jugador
        })), 'drops'
      )}
      
      {renderStat('Árbitro Presente', matchData.asistioArbitro ? 'Sí' : 'No', [], 'arbitro')}
      {renderStat('Médico Presente', matchData.asistioParamedico ? 'Sí' : 'No', [], 'medico')}
      
      <View style={styles.divider} />
      
      <View style={styles.teamContainer}>
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>{equipoLocal}</Text>
        {renderStat('Tarjetas Amarillas', estadisticasLocal.tarjetasAmarillas, [], 'localTarjetasAmarillas')}
        {renderStat('Tarjetas Rojas', estadisticasLocal.tarjetasRojas, [], 'localTarjetasRojas')}
        {renderStat('Lesiones', estadisticasLocal.lesiones, [], 'localLesiones')}
        {renderStat('Cambios', estadisticasLocal.cambios, [], 'localCambios')}
        {renderStat('Tries', estadisticasLocal.tries, [], 'localTries')}
        {renderStat('Conversiones', estadisticasLocal.conversiones, [], 'localConversiones')}
        {renderStat('Drops', estadisticasLocal.drops, [], 'localDrops')}
      </View>
      
      <View style={styles.teamContainer}>
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>{equipoVisitante}</Text>
        {renderStat('Tarjetas Amarillas', estadisticasVisitante.tarjetasAmarillas, [], 'visitanteTarjetasAmarillas')}
        {renderStat('Tarjetas Rojas', estadisticasVisitante.tarjetasRojas, [], 'visitanteTarjetasRojas')}
        {renderStat('Lesiones', estadisticasVisitante.lesiones, [], 'visitanteLesiones')}
        {renderStat('Cambios', estadisticasVisitante.cambios, [], 'visitanteCambios')}
        {renderStat('Tries', estadisticasVisitante.tries, [], 'visitanteTries')}
        {renderStat('Conversiones', estadisticasVisitante.conversiones, [], 'visitanteConversiones')}
        {renderStat('Drops', estadisticasVisitante.drops, [], 'visitanteDrops')}
      </View>
      
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.l,
    marginBottom: Layout.spacing.l,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Layout.spacing.m,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.s,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  value: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginRight: 4,
  },
  chevron: {
    marginLeft: 4,
  },
  subItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.xs,
    paddingLeft: Layout.spacing.m,
    paddingRight: Layout.spacing.s,
  },
  subLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  subValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  teamContainer: {
    marginTop: Layout.spacing.l,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.tabIconDefault,
    marginVertical: Layout.spacing.m,
    opacity: 0.2,
  },
});

export default MatchStatsCard;